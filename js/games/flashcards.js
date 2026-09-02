/* ==========================================================================
   MORSE SPACE CADET - FLASHCARDS & VISUAL MNEMONICS LIBRARY
   ========================================================================== */

class FlashcardsMode {
  constructor() {
    this.currentFilter = "all"; // 'all', 'alpha', 'num'
  }

  init() {
    this.renderGrid();

    // Filter tabs
    const filterBtns = document.querySelectorAll(".flashcard-filter-btn");
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.getAttribute("data-filter");
        this.renderGrid();
      });
    });
  }

  renderGrid() {
    const grid = document.getElementById("flashcardGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const entries = Object.entries(MORSE);

    entries.forEach(([char, code]) => {
      const isNum = /[0-9]/.test(char);
      const isAlpha = /[A-Z]/.test(char);

      if (this.currentFilter === "alpha" && !isAlpha) return;
      if (this.currentFilter === "num" && !isNum) return;

      const mnemonic = MNEMONICS[char] || {
        icon: isNum ? "🔢" : "✨",
        word: `Ký tự ${char}`,
        hint: `Mã Morse của ${char}`
      };

      const card = document.createElement("div");
      card.className = "mnemonic-card anim-pop";
      card.innerHTML = `
        <div class="mnemonic-letter">${char}</div>
        <div class="mnemonic-code">${formatMorseSymbols(code)}</div>
        <div class="mnemonic-icon">${mnemonic.icon}</div>
        <div class="mnemonic-word">${mnemonic.word}</div>
      `;

      card.addEventListener("click", () => {
        soundEngine.playMorse(code);
        visualEngine.setMascotState(`${char} = ${formatMorseSymbols(code)}: ${mnemonic.hint}`, "happy");
      });

      grid.appendChild(card);
    });
  }
}

// Global Flashcards Instance
const flashcardsGame = new FlashcardsMode();
