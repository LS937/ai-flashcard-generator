function deleteFlashcard(index) {
  if (confirm("Are you sure you want to delete this flashcard?")) {
    fetch("/delete-flashcard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index: parseInt(index) }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const flashcardElement = document
            .getElementById(`flashcard-${index}`)
            .closest(".flashcard");
          if (flashcardElement) {
            flashcardElement.remove();
          }

          // Update indices for remaining flashcards
          const remainingFlashcards = document.querySelectorAll(".flashcard");
          remainingFlashcards.forEach((card, newIndex) => {
            const cardDiv = card.querySelector('[id^="flashcard-"]');
            if (cardDiv) {
              cardDiv.id = `flashcard-${newIndex}`;
            }
            
            // Update question label
            const questionLabel = card.querySelector('label');
            if (questionLabel) {
              questionLabel.textContent = `Question ${newIndex + 1}`;
            }
            
            // Update form field names
            const questionInput = card.querySelector('input[name*="question"]');
            const answerTextarea = card.querySelector('textarea[name*="answer"]');
            const deleteBtn = card.querySelector('.delete-btn');
            
            if (questionInput) {
              questionInput.name = `flashcards[${newIndex}][question]`;
            }
            if (answerTextarea) {
              answerTextarea.name = `flashcards[${newIndex}][answer]`;
            }
            if (deleteBtn) {
              deleteBtn.setAttribute('data-index', newIndex);
              deleteBtn.setAttribute('onclick', `deleteFlashcard('${newIndex}')`);
            }
          });

          if (remainingFlashcards.length === 0) {
            const form = document.querySelector("form");
            form.innerHTML =
              '<div class="text-[#264653]">No flashcards to edit.</div>';
          }
        } else {
          alert("Failed to delete flashcard: " + (data.message || "Unknown error"));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to delete flashcard");
      });
  }
}
