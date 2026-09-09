/* ==========================================================================
   MORSE SPACE CADET - WORD & SENTENCE DECODER (KHÔNG GỢI Ý)
   ========================================================================== */

class WordDecoderMode {
  constructor() {
    this.mode = "word"; // "word" or "sentence"
    this.wordData = null;
    this.sentenceData = null;
    this.sentenceWords = [];
    this.flatLetters = []; // [{ char, wordIdx, charIdx, globalIdx }]
    this.currentIdx = 0;
    this.isLocked = false;
    this.completedMissions = 0;
  }

  init() {
    // Mode toggles
    const btnWord = document.getElementById("btnDecoderModeWord");
    const btnSent = document.getElementById("btnDecoderModeSentence");
    if (btnWord && btnSent) {
      btnWord.addEventListener("click", () => this.switchMode("word"));
      btnSent.addEventListener("click", () => this.switchMode("sentence"));
    }

    const playLetterBtn = document.getElementById("wordPlayLetterBtn");
    if (playLetterBtn) {
      playLetterBtn.addEventListener("click", () => this.playCurrentLetterAudio());
    }

    const playWordBtn = document.getElementById("wordPlayFullBtn");
    if (playWordBtn) {
      playWordBtn.addEventListener("click", () => this.playCurrentWordAudio());
    }

    const playSentenceBtn = document.getElementById("wordPlaySentenceBtn");
    if (playSentenceBtn) {
      playSentenceBtn.addEventListener("click", () => this.playFullSentenceAudio());
    }

    const nextMissionBtn = document.getElementById("wordNextMissionBtn");
    if (nextMissionBtn) {
      nextMissionBtn.addEventListener("click", () => this.startNewMission());
    }
  }

  switchMode(newMode) {
    if (this.mode === newMode) return;
    this.mode = newMode;
    soundEngine.playLetterPop();

    const btnWord = document.getElementById("btnDecoderModeWord");
    const btnSent = document.getElementById("btnDecoderModeSentence");
    if (btnWord && btnSent) {
      btnWord.classList.toggle("active", this.mode === "word");
      btnSent.classList.toggle("active", this.mode === "sentence");
    }

    const playSentenceBtn = document.getElementById("wordPlaySentenceBtn");
    const playWordBtn = document.getElementById("wordPlayFullBtn");
    if (this.mode === "sentence") {
      if (playSentenceBtn) playSentenceBtn.style.display = "inline-flex";
      if (playWordBtn) playWordBtn.textContent = "🎵 Nghe Từ Này";
    } else {
      if (playSentenceBtn) playSentenceBtn.style.display = "none";
      if (playWordBtn) playWordBtn.textContent = "🎵 Nghe Cả Từ";
    }

    this.startNewMission();
  }

  startNewMission() {
    this.isLocked = false;
    this.currentIdx = 0;

    if (this.mode === "word") {
      this.startWordMission();
    } else {
      this.startSentenceMission();
    }

    this.renderKeyboard();
  }

  startWordMission() {
    const randomIndex = Math.floor(Math.random() * SECRET_WORDS.length);
    this.wordData = SECRET_WORDS[randomIndex];

    // KHÔNG THÊM GỢI Ý - BẢO MẬT TUYỆT ĐỐI CHO ĐIỆP VIÊN
    document.getElementById("wordCategoryClue").innerHTML = `🔒 MẬT MÃ TỪ VỰNG · <b style="color:var(--neon-cyan)">KHÔNG GỢI Ý</b> · ${this.wordData.word.length} KÝ TỰ`;
    document.getElementById("wordFeedbackMsg").textContent = "Lắng nghe tín hiệu âm thanh của ô đang sáng!";

    this.renderWordSlots();
    visualEngine.setMascotState(`Nhiệm vụ bí mật: Lắng nghe và giải mã từ ${this.wordData.word.length} chữ cái này!`, "thinking");

    setTimeout(() => this.playCurrentLetterAudio(), 400);
  }

  startSentenceMission() {
    const randomIndex = Math.floor(Math.random() * SECRET_SENTENCES.length);
    this.sentenceData = SECRET_SENTENCES[randomIndex];
    this.sentenceWords = this.sentenceData.text.split(" ");

    // Flatten letters for indexing
    this.flatLetters = [];
    let gIdx = 0;
    this.sentenceWords.forEach((word, wIdx) => {
      [...word].forEach((char, cIdx) => {
        this.flatLetters.push({ char, wordIdx: wIdx, charIdx: cIdx, globalIdx: gIdx });
        gIdx++;
      });
    });

    // KHÔNG THÊM GỢI Ý NGHĨA - BẢO MẬT TUYỆT ĐỐI CHO ĐIỆP VIÊN
    document.getElementById("wordCategoryClue").innerHTML = `🔒 MẬT MÃ CÂU DÀI · <b style="color:var(--neon-cyan)">KHÔNG GỢI Ý</b> · ${this.sentenceWords.length} TỪ · ${this.flatLetters.length} KÝ TỰ`;
    document.getElementById("wordFeedbackMsg").textContent = "Điện tín dài 5-7 chữ! Lắng nghe và giải mã từng từ.";

    this.renderSentenceSlots();
    visualEngine.setMascotState(`Điện tín vũ trụ: ${this.sentenceWords.length} chữ cái đang chờ bạn giải mã!`, "thinking");

    setTimeout(() => this.playCurrentLetterAudio(), 400);
  }

  renderWordSlots() {
    const container = document.getElementById("wordMysterySlots");
    if (!container) return;
    container.innerHTML = "";

    const letters = [...this.wordData.word];
    letters.forEach((char, idx) => {
      const slot = document.createElement("div");
      slot.className = `mystery-slot ${idx === 0 ? "current" : ""}`;
      slot.id = `slot_${idx}`;
      slot.textContent = "?";
      container.appendChild(slot);
    });
  }

  renderSentenceSlots() {
    const container = document.getElementById("wordMysterySlots");
    if (!container) return;
    container.innerHTML = "";

    const sentenceBox = document.createElement("div");
    sentenceBox.className = "mystery-sentence-container";

    let letterCounter = 0;
    this.sentenceWords.forEach((word, wIdx) => {
      const wordGroup = document.createElement("div");
      wordGroup.className = "mystery-word-group";

      [...word].forEach((char, cIdx) => {
        const slot = document.createElement("div");
        slot.className = `mystery-slot sentence-slot ${letterCounter === 0 ? "current" : ""}`;
        slot.id = `slot_${letterCounter}`;
        slot.textContent = "?";
        wordGroup.appendChild(slot);
        letterCounter++;
      });

      sentenceBox.appendChild(wordGroup);
    });

    container.appendChild(sentenceBox);
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
    soundEngine.init();
    if (this.mode === "word") {
      if (!this.wordData) return;
      const char = this.wordData.word[this.currentIdx];
      soundEngine.playMorse(MORSE[char]);
    } else {
      if (!this.flatLetters[this.currentIdx]) return;
      const char = this.flatLetters[this.currentIdx].char;
      soundEngine.playMorse(MORSE[char]);
    }
  }

  playCurrentWordAudio() {
    soundEngine.init();
    if (this.mode === "word") {
      if (!this.wordData) return;
      const code = [...this.wordData.word].map(c => MORSE[c]).join(" ");
      soundEngine.playMorse(code);
    } else {
      if (!this.flatLetters[this.currentIdx]) return;
      const wIdx = this.flatLetters[this.currentIdx].wordIdx;
      const word = this.sentenceWords[wIdx];
      const code = [...word].map(c => MORSE[c]).join(" ");
      soundEngine.playMorse(code);
    }
  }

  playFullSentenceAudio() {
    soundEngine.init();
    if (this.mode === "sentence" && this.sentenceWords.length > 0) {
      // Dấu gạch chéo '/' biểu thị khoảng nghỉ 7-dit giữa các từ
      const sentenceMorse = this.sentenceWords
        .map(w => [...w].map(c => MORSE[c]).join(" "))
        .join(" / ");
      soundEngine.playMorse(sentenceMorse);
    }
  }

  handleKeyClick(selectedChar, btnEl) {
    if (this.isLocked) return;
    soundEngine.init();
    soundEngine.playLetterPop();

    if (this.mode === "word") {
      this.handleWordKey(selectedChar, btnEl);
    } else {
      this.handleSentenceKey(selectedChar, btnEl);
    }
  }

  handleWordKey(selectedChar, btnEl) {
    if (!this.wordData) return;
    const expectedChar = this.wordData.word[this.currentIdx];

    if (selectedChar === expectedChar) {
      soundEngine.playSuccessChime();
      storage.addXp(10);

      const slot = document.getElementById(`slot_${this.currentIdx}`);
      if (slot) {
        slot.textContent = expectedChar;
        slot.classList.remove("current");
        slot.classList.add("revealed");
      }

      this.currentIdx++;

      if (this.currentIdx >= this.wordData.word.length) {
        this.solveWordSuccess();
      } else {
        const nextSlot = document.getElementById(`slot_${this.currentIdx}`);
        if (nextSlot) nextSlot.classList.add("current");

        document.getElementById("wordFeedbackMsg").textContent = `Chính xác! Tiếp tục giải chữ thứ ${this.currentIdx + 1}.`;
        setTimeout(() => this.playCurrentLetterAudio(), 450);
      }
    } else {
      soundEngine.playWrongBoop();
      if (btnEl) btnEl.classList.add("wrong-burst");
      document.getElementById("wordFeedbackMsg").textContent = `Chưa đúng! Hãy nghe lại chữ này nhé.`;
      setTimeout(() => {
        if (btnEl) btnEl.classList.remove("wrong-burst");
        this.playCurrentLetterAudio();
      }, 550);
    }
  }

  handleSentenceKey(selectedChar, btnEl) {
    if (!this.flatLetters[this.currentIdx]) return;
    const item = this.flatLetters[this.currentIdx];
    const expectedChar = item.char;

    if (selectedChar === expectedChar) {
      soundEngine.playSuccessChime();
      storage.addXp(10);

      const slot = document.getElementById(`slot_${this.currentIdx}`);
      if (slot) {
        slot.textContent = expectedChar;
        slot.classList.remove("current");
        slot.classList.add("revealed");
      }

      this.currentIdx++;

      if (this.currentIdx >= this.flatLetters.length) {
        this.solveSentenceSuccess();
      } else {
        const nextSlot = document.getElementById(`slot_${this.currentIdx}`);
        if (nextSlot) nextSlot.classList.add("current");

        const nextWordIdx = this.flatLetters[this.currentIdx].wordIdx;
        const currentWordNum = nextWordIdx + 1;
        document.getElementById("wordFeedbackMsg").textContent = `Đúng rồi! Đang giải từ thứ ${currentWordNum}/${this.sentenceWords.length}.`;
        setTimeout(() => this.playCurrentLetterAudio(), 450);
      }
    } else {
      soundEngine.playWrongBoop();
      if (btnEl) btnEl.classList.add("wrong-burst");
      document.getElementById("wordFeedbackMsg").textContent = `Chưa đúng! Lắng nghe lại tín hiệu Morse nhé.`;
      setTimeout(() => {
        if (btnEl) btnEl.classList.remove("wrong-burst");
        this.playCurrentLetterAudio();
      }, 550);
    }
  }

  solveWordSuccess() {
    this.isLocked = true;
    this.completedMissions++;
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
        <div class="modal-icon">${this.wordData.icon || "🎉"}</div>
        <div class="modal-title">${this.wordData.word}</div>
        <p style="font-size:1.15rem; color:var(--neon-green); font-weight:800; margin-bottom: 8px;">✨ GIẢI MÃ THÀNH CÔNG (KHÔNG GỢI Ý)!</p>
        <p class="modal-desc">Đôi tai mật vụ xuất sắc! Bạn đã phá vỡ bức mật thư bằng chính khả năng nghe Morse.</p>
        <p style="color:var(--neon-amber); font-weight:800; margin-bottom: 20px;">+50 XP Thưởng Điệp Viên</p>
        <div class="modal-actions">
          <button class="btn btn-primary btn-lg" id="wordNextModalBtn">Từ Tiếp Theo 🚀</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector("#wordNextModalBtn").addEventListener("click", () => {
      modal.remove();
      this.startNewMission();
    });
  }

  solveSentenceSuccess() {
    this.isLocked = true;
    this.completedMissions++;
    storage.data.sentencesDecodedCount = (storage.data.sentencesDecodedCount || 0) + 1;
    storage.addXp(150);

    visualEngine.launchConfetti();
    soundEngine.playSentenceVictoryFanfare();
    visualEngine.setMascotState(`Tuyệt đỉnh! Bạn vừa giải mã thành công toàn bộ câu điện tín dài!`, "cheer");

    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-box" style="max-width: 520px;">
        <div class="modal-icon">🌌</div>
        <div class="modal-title" style="font-size: 1.6rem; letter-spacing: 2px;">${this.sentenceData.text}</div>
        <p style="font-size:1.1rem; color:var(--neon-cyan); margin-bottom: 8px;">Dịch nghĩa: "${this.sentenceData.vi}"</p>
        <p class="modal-desc">Bản lĩnh của một chuyên gia điện tín thực thụ! Bạn đã phá mã thành công một bức điện tín dài 5-7 chữ hoàn toàn không cần gợi ý.</p>
        <p style="color:var(--neon-amber); font-weight:800; font-size: 1.2rem; margin-bottom: 20px;">+150 XP Thưởng Đại Sứ Vũ Trụ</p>
        <div class="modal-actions">
          <button class="btn btn-primary btn-lg" id="wordNextModalBtn">Câu Mật Mã Tiếp Theo 🚀</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector("#wordNextModalBtn").addEventListener("click", () => {
      modal.remove();
      this.startNewMission();
    });
  }
}

// Global Word Decoder Instance
const wordDecoderGame = new WordDecoderMode();
