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

          const remainingFlashcards = document.querySelectorAll(".flashcard");
          if (remainingFlashcards.length === 0) {
            const form = document.querySelector("form");
            form.innerHTML =
              '<div class="text-[#264653]">No flashcards to edit.</div>';
          }
        } else {
          alert("Failed to delete flashcard");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to delete flashcard");
      });
  }
}
