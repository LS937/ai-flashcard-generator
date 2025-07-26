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
  // Ensure jsPDF is loaded
  if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
    alert('jsPDF library is not loaded. Please include jsPDF in your HTML.');
    return;
  }
  const jsPDFConstructor = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
  const doc = new jsPDFConstructor({
    orientation: 'landscape',
    unit: 'in',
    format: [6, 4],
    compress: true
  });

  const flashcards = document.querySelectorAll('.flashcard');
  flashcards.forEach((card, index) => {
    if (index > 0) doc.addPage();
    // Card box dimensions
    const boxX = 0.25, boxY = 0.25, boxW = 5.5, boxH = 3.5;
    // Draw box
    doc.setDrawColor(51, 51, 51);
    doc.setLineWidth(0.05);
    doc.roundedRect(boxX, boxY, boxW, boxH, 0.2, 0.2, 'S');
    // Fill background
    doc.setFillColor(255,255,255);
    doc.rect(boxX, boxY, boxW, boxH, 'F');

    // Title: Question
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(51,51,51);
    doc.text(`Question ${index + 1}`, boxX + boxW/2, boxY + 0.6, {align: 'center'});

    // Question text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(68,68,68);
    const question = card.dataset.question || '';
    let qLines = doc.splitTextToSize(question, boxW - 0.5);
    doc.text(qLines, boxX + boxW/2, boxY + 1.0, {align: 'center'});

    // Divider
    doc.setDrawColor(200,200,200);
    doc.setLineWidth(0.01);
    doc.line(boxX + 0.5, boxY + 1.5, boxX + boxW - 0.5, boxY + 1.5, 'D');

    // Title: Answer
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(51,51,51);
    doc.text(`Answer ${index + 1}`, boxX + boxW/2, boxY + 2.0, {align: 'center'});

    // Answer text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(68,68,68);
    const answer = card.dataset.answer || '';
    let aLines = doc.splitTextToSize(answer, boxW - 0.5);
    doc.text(aLines, boxX + boxW/2, boxY + 2.4, {align: 'center'});
  });

  doc.save('flashcards.pdf');
}
