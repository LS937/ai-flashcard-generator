const express = require("express");
const app = express();
const path = require("path");
const { OpenAI } = require("openai");
const session = require('express-session');
const flash = require('connect-flash');

require("dotenv").config();



const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // Change to your deployed site if needed
        "X-Title": "Flashcard Generator"
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/edit", (req, res) => {
    const flashcards = req.session.flashcards || [];
    res.render('edit', { flashcards: flashcards });
});

app.post("/edit", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim() === "") {
            req.flash('error_msg', 'No text provided');
            return res.redirect('/');
        }

        const MAX_INPUT_LENGTH = 2000;
        if (text.length > MAX_INPUT_LENGTH) {
            req.flash('error_msg', `Input text is too long. Maximum length is ${MAX_INPUT_LENGTH} characters.`);
            return res.redirect('/');
        }

        const prompt = `Generate flashcards in the following format:\n{\n  \"flashcards\": [\n    {\"question\": \"Q1\", \"answer\": \"A1\"},\n    {\"question\": \"Q2\", \"answer\": \"A2\"}\n  ]\n}\nBased on this text: ${text}`;

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4.1",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that generates educational flashcards."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 512
        });

        let flashcards;
        try {
            flashcards = JSON.parse(completion.choices[0].message.content);
        } catch (parseError) {
            req.flash('error_msg', 'Failed to parse flashcards from model response.');
            return res.redirect('/');
        }

        req.session.flashcards = flashcards.flashcards;
        
        res.render('edit', { success: true, flashcards: flashcards.flashcards });
    } catch (error) {
        console.error("Error generating flashcards:", error);
        req.flash('error_msg', error.message || 'Failed to generate flashcards');
        res.redirect('/');
    }
});

app.post("/generated-flashcards", (req, res) => {
    const flashcards = req.body.flashcards;
    res.render("generated-flashcards", { flashcards });
});

app.post("/delete-flashcard", (req, res) => {
    try {
        const { index } = req.body;
        if (typeof index !== 'number' || index < 0) {
            return res.json({ success: false, message: 'Invalid index' });
        }

        const flashcards = req.session.flashcards || [];
        
        if (index >= flashcards.length) {
            return res.json({ success: false, message: 'Flashcard not found' });
        }
        
        flashcards.splice(index, 1);
        
        req.session.flashcards = flashcards;
        
        res.json({ success: true, message: 'Flashcard deleted successfully' });
    } catch (error) {
        console.error("Error deleting flashcard:", error);
        res.json({ success: false, message: error.message || 'Failed to delete flashcard' });
    }
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
