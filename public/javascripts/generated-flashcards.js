// Flipping effect for flashcard

document.addEventListener('DOMContentLoaded', function() {
    const flashcards = document.querySelectorAll('.flashcard');
    if (!flashcards.length) return;

    flashcards.forEach(function(flashcard) {
        let flipped = false;
        flashcard.style.transition = 'transform 0.6s';
        flashcard.style.transformStyle = 'preserve-3d';
        flashcard.style.position = 'relative';

        // Set up front and back
        const front = flashcard.querySelector('.front');
        const back = flashcard.querySelector('.back');
        if (front && back) {
            front.style.position = 'absolute';
            front.style.width = '100%';
            front.style.height = '100%';
            front.style.backfaceVisibility = 'hidden';
            back.style.position = 'absolute';
            back.style.width = '100%';
            back.style.height = '100%';
            back.style.backfaceVisibility = 'hidden';
            back.style.transform = 'rotateY(180deg)';
        }

        flashcard.addEventListener('click', function() {
            flipped = !flipped;
            if (flipped) {
                flashcard.style.transform = 'rotateY(180deg)';
            } else {
                flashcard.style.transform = 'rotateY(0deg)';
            }
        });
    });
});


document.querySelectorAll(".section")
.forEach(function(e) {
    gsap.to(e, {
        scrollTrigger: {
            trigger: e,
            start: "top 50%",
            end: "bottom 50%",
            markers: false,
            onEnter: function() {
                document.body.setAttribute("theme", e.dataset.color);
            },
            onEnterBack: function() {
                document.body.setAttribute("theme", e.dataset.color);
            },
            
        }
    });
});


function downloadPDF() {
  const pdfContainer = document.createElement("div");
  const flashcards = document.querySelectorAll(".flashcard");

  flashcards.forEach((card, index) => {
    const question = card.dataset.question;
    const answer = card.dataset.answer;
    const pageElement = document.createElement("div");

    // --- START OF CHANGE ---

    // Define the base styles for every page container
    let pageStyle = `
                width: 6in; 
                height: 4in; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                box-sizing: border-box;
            `;

    // IMPORTANT: Add the page break style ONLY if it's NOT the last flashcard.
    // This prevents the extra blank page at the end or between pages.
    if (index < flashcards.length - 1) {
      pageStyle += `page-break-after: always;`;
    }

    pageElement.style.cssText = pageStyle;

    // --- END OF CHANGE ---

    // The inner content of the card remains the same
    pageElement.innerHTML = `
                <div style="
                    width: 95%; 
                    height: 95%; 
                    border: 2px solid #333; 
                    border-radius: 15px; 
                    background-color: white; 
                    padding: 20px; 
                    display: flex; 
                    flex-direction: column; 
                    justify-content: center; 
                    align-items: center; 
                    text-align: center;
                    box-sizing: border-box;
                    font-family: 'Roboto Slab', serif;
                ">
                    <div style="margin-bottom: 20px;">
                        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 10px; color: #333;">Question ${
                          index + 1
                        }</h2>
                        <p style="font-size: 1.1rem; color: #444; line-height: 1.5;">${question}</p>
                    </div>
                    
                    <div style="border-top: 1px dashed #ccc; width: 80%; margin: 15px 0;"></div>

                    <div>
                        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 10px; color: #333;">Answer ${
                          index + 1
                        }</h2>
                        <p style="font-size: 1.1rem; color: #444; line-height: 1.5;">${answer}</p>
                    </div>
                </div>
            `;

    pdfContainer.appendChild(pageElement);
  });

  // PDF options remain the same
  const opt = {
    margin: 0,
    filename: "flashcards.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
    },
    jsPDF: {
      unit: "in",
      format: [6, 4],
      orientation: "landscape",
      compress: true,
    },
    pagebreak: { mode: ["css", "legacy"] },
  };

  html2pdf().set(opt).from(pdfContainer).save();
}
