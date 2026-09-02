/* ==========================================================================
   MORSE SPACE CADET - WORD DECODER (SECRET WORD MISSION)
   ========================================================================== */

class WordDecoderMode {
  constructor() {
    this.wordData = null;
    this.currentLetterIdx = 0;
    this.isLocked = false;
    this.completedWords = 0;
  }

  init() {
    const playWordBtn = document.getElementById("wordPlayLetterBtn");
    if (playWordBtn) {
      playWordBtn.addEventListener("click", () => this.playCurrentLetterAudio());
    }

    const playFullBtn = document.getElementById("wordPlayFullBtn");
    if (playFullBtn) {
      playFullBtn.addEventListener("click", () => this.playFullWordAudio());
    }

    const nextWordBtn = document.getElementById("wordNextMissionBtn");
    if (nextWordBtn) {
      nextWordBtn.addEventListener("click", () => this.startNewWord());
    }
  }

  startNewWord() {
    this.isLocked = false;
    this.currentLetterIdx = 0;

    // Pick random secret word
    const randomIndex = Math.floor(Math.random() * SECRET_WORDS.length);
    this.wordData = SECRET_WORDS[randomIndex];

    document.getElementById("wordCategoryClue").textContent = `Chủ đề: ${this.wordData.category} · Gợi ý: "${this.wordData.clue}"`;
    document.getElementById("wordFeedbackMsg").textContent = "Lắng nghe tín hiệu của ô đang chọn!";

    this.renderSlots();
    this.renderKeyboard();

    visualEngine.setMascotState(`Nhiệm vụ bí mật: Hãy giải mã từ ${this.wordData.word.length} chữ cái này!`, "thinking");

    setTimeout(() => {
      this.playCurrentLetterAudio();
    }, 400);
  }

  renderSlots() {
    const container = document.getElementById("wordMysterySlots");
    if (!container) return;
    container.innerHTML = "";

    const letters = [...this.wordData.word];
    letters.forEach((char, idx) => {
      const slot = document.createElement("div");
      slot.className = `mystery-slot ${idx === 0 ? "current" : ""}`;
      slot.id = `wordSlot_${idx}`;
      slot.textContent = "?";
      container.appendChild(slot);
    });
  }

  renderKeyboard() {
    const keyboard = document.getElementById("wordKeyboard");
    if (!keyboard) return;
    keyboard.innerHTML = "";

    const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    rows.forEach((rowChars) => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "keyboard-row";

      [...rowChars].forEach((char) => {
        const key = document.createElement("button");
        key.className = "key-btn active";
        key.textContent = char;
        key.addEventListener("click", () => this.handleKeyClick(char, key));
        rowDiv.appendChild(key);
      });

      keyboard.appendChild(rowDiv);
    });
  }

  playCurrentLetterAudio() {
    if (!this.wordData) return;
    const targetChar = this.wordData.word[this.currentLetterIdx];
    const code = MORSE[targetChar];
    soundEngine.playMorse(code);
  }

  playFullWordAudio() {
    if (!this.wordData) return;
    const fullCode = [...this.wordData.word].map((c) => MORSE[c]).join(" ");
    soundEngine.playMorse(fullCode);
  }

  handleKeyClick(selectedChar, btnEl) {
    if (this.isLocked || !this.wordData) return;
    soundEngine.init();

    const expectedChar = this.wordData.word[this.currentLetterIdx];

    if (selectedChar === expectedChar) {
      // Correct letter slot!
      soundEngine.playSuccessChime();
      storage.addXp(10);

      const slot = document.getElementById(`wordSlot_${this.currentLetterIdx}`);
      if (slot) {
        slot.textContent = expectedChar;
        slot.classList.remove("current");
        slot.classList.add("revealed");
      }

      this.currentLetterIdx++;

      // Check if full word solved!
      if (this.currentLetterIdx >= this.wordData.word.length) {
        this.solveWordSuccess();
      } else {
        // Move to next slot
        const nextSlot = document.getElementById(`wordSlot_${this.currentLetterIdx}`);
        if (nextSlot) nextSlot.classList.add("current");

        document.getElementById("wordFeedbackMsg").textContent = `Chính xác! Tiếp tục giải chữ thứ ${this.currentLetterIdx + 1}.`;
        setTimeout(() => this.playCurrentLetterAudio(), 500);
      }
    } else {
      // Wrong letter
      soundEngine.playWrongBoop();
      if (btnEl) btnEl.classList.add("wrong-burst");
      document.getElementById("wordFeedbackMsg").textContent = `Chưa đúng! Hãy nghe lại chữ này nhé.`;
      setTimeout(() => {
        if (btnEl) btnEl.classList.remove("wrong-burst");
        this.playCurrentLetterAudio();
      }, 600);
    }
  }

  solveWordSuccess() {
    this.isLocked = true;
    this.completedWords++;
    storage.data.wordsDecodedCount = (storage.data.wordsDecodedCount || 0) + 1;
    storage.addXp(50);

    if (storage.data.wordsDecodedCount >= 3) {
      storage.unlockBadge("word_hunter");
    }

    visualEngine.launchConfetti();
    soundEngine.playLevelUpFanfare();
    visualEngine.setMascotState(`Hoan hô! Bạn vừa giải mã thành công từ "${this.wordData.word}"!`, "cheer");

    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-icon">${this.wordData.icon}</div>
        <div class="modal-title">${this.wordData.word}</div>
        <p style="font-size:1.1rem; color:var(--neon-cyan); margin-bottom: 8px;">"${this.wordData.clue}"</p>
        <p class="modal-desc">Bạn vừa giải mã thành công bức điện tín bí mật!</p>
        <p style="color:var(--neon-amber); font-weight:800; margin-bottom: 20px;">+50 XP Thưởng</p>
        <div class="modal-actions">
          <button class="btn btn-primary btn-lg" id="wordNextModalBtn">Từ Bí Mật Tiếp Theo 🚀</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector("#wordNextModalBtn").addEventListener("click", () => {
      modal.remove();
      this.startNewWord();
    });
  }
}

// Global Word Decoder Instance
const wordDecoderGame = new WordDecoderMode();
