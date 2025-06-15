# Flash Card Generator

An AI-powered flashcard generator that helps users create study materials efficiently. This application uses OpenAI's API to generate high-quality flashcards from any text input.

## Features

- AI-powered flashcard generation from text input
- Interactive flashcard interface
- Edit and delete generated flashcards
- Session-based temporary storage
- Responsive design for all devices

## Tech Stack

- Node.js
- Express.js
- EJS templating
- OpenAI API
- Express Session
- Tailwind CSS
- Remix Icons

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/LS937/ai-flashcard-generator.git
cd ai-flashcard-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following variables:
```
OPENROUTER_API_KEY=your_openrouter_api_key
```

4. Start the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Usage

1. Enter your text in the input field (maximum 2000 characters)
2. Let the AI generate flashcards for you
3. Review and edit the generated flashcards
4. Delete any unwanted flashcards
5. Start studying!

## API Endpoints

- `POST /edit` - Generate new flashcards from input text
- `POST /generated-flashcards` - View generated flashcards
- `POST /delete-flashcard` - Delete a specific flashcard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the API
- All contributors who have helped shape this project

## Contact

Project Link: [https://github.com/LS937/ai-flashcard-generator](https://github.com/LS937/ai-flashcard-generator) 