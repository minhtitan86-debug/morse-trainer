/* ==========================================================================
   MORSE SPACE CADET - ADVENTURE MODE (13 KOCH LESSONS & BOSS CHALLENGES)
   ========================================================================== */

class AdventureMode {
  constructor() {
    this.currentLevelIndex = 0; // 0-based index in LEVELS_LIST
    this.levelData = null;
    this.targetQuestionCount = 15;
    this.currentQuestionIndex = 0;
    this.currentLetter = "";
    this.score = 0;
    this.tries = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.hearts = 3;
    this.isLocked = false;
    this.levelOneAlternator = 0;
  }

  init() {
    // Render Level Selection Grid on load
    this.renderLevelMap();
  }

  renderLevelMap() {
    const grid = document.getElementById("levelMapGrid");
    if (!grid) return;
    grid.innerHTML = "";

    LEVELS_LIST.forEach((level, idx) => {
      const isUnlocked = level.levelNumber <= storage.data.unlockedLevel;
      const starsCount = storage.data.stars[level.levelNumber] || 0;
      const isChallenge = level.type === "challenge";

      const card = document.createElement("div");
      card.className = `level-card-btn ${isUnlocked ? "" : "locked"} ${isChallenge ? "challenge" : ""} ${level.levelNumber === storage.data.unlockedLevel ? "current" : ""}`;
      
      const starsHtml = isUnlocked
        ? "★".repeat(starsCount) + "☆".repeat(3 - starsCount)
        : "🔒 Khóa";

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="level-num-badge">${isChallenge ? "👑 BOSS" : `LEVEL ${level.levelNumber}`}</span>
          <span class="level-stars">${starsHtml}</span>
        </div>
        <div style="font-size: 1.05rem; font-weight: 800; color: #fff;">${level.name}</div>
        <div class="level-letters-tag">${level.letters.join(" · ")}</div>
      `;

      if (isUnlocked) {
        card.addEventListener("click", () => {
          soundEngine.playClickTap();
          this.startLevel(idx);
        });
      }

      grid.appendChild(card);
    });
  }

  startLevel(index) {
    this.currentLevelIndex = index;
    this.levelData = LEVELS_LIST[index];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.tries = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.hearts = 3;
    this.isLocked = false;
    this.levelOneAlternator = 0;
    this.targetQuestionCount = this.levelData.type === "challenge" ? 20 : 15;

    // Switch views
    document.getElementById("levelSelectView").classList.add("hidden");
    document.getElementById("adventurePlayView").classList.remove("hidden");

    // Update Headers
    document.getElementById("advLevelTitle").textContent = `${this.levelData.type === "challenge" ? "👑 " : "🚀 "}${this.levelData.name}`;
    document.getElementById("advLevelLetters").textContent = `Ký tự: ${this.levelData.letters.join(" · ")}`;
    
    const challengeHud = document.getElementById("advChallengeHud");
    if (this.levelData.type === "challenge") {
      challengeHud.classList.remove("hidden");
      this.updateHeartsDisplay();
    } else {
      challengeHud.classList.add("hidden");
    }

    this.renderKeyboard();
    this.renderNewLetterCards();
    this.updateProgress();

    visualEngine.setMascotState(
      `Chào mừng đến với ${this.levelData.name}! Hãy lắng nghe thật kỹ nhé!`,
      "cheer"
    );

    this.nextQuestion();
  }

  renderNewLetterCards() {
    const container = document.getElementById("advNewLetterCards");
    if (!container) return;
    container.innerHTML = "";

    if (this.levelData.newLetters && this.levelData.newLetters.length > 0) {
      this.levelData.newLetters.forEach((char) => {
        const code = MORSE[char];
        const card = document.createElement("div");
        card.className = "hud-pill";
        card.style.background = "rgba(0, 240, 255, 0.15)";
        card.style.borderColor = "var(--neon-cyan)";
        card.style.color = "#fff";
        card.innerHTML = `<strong>${char}</strong>: <span style="color:var(--neon-cyan); letter-spacing:2px;">${formatMorseSymbols(code)}</span>`;
        container.appendChild(card);
      });
    }
  }

  renderKeyboard() {
    const keyboard = document.getElementById("advKeyboard");
    if (!keyboard) return;
    keyboard.innerHTML = "";

    const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    rows.forEach((rowChars) => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "keyboard-row";

      [...rowChars].forEach((char) => {
        const key = document.createElement("button");
        key.className = "key-btn";
        key.textContent = char;
        key.id = `advKey_${char}`;

        const isIncluded = this.levelData.letters.includes(char);
        if (isIncluded) {
          key.classList.add("active");
          key.addEventListener("click", () => this.handleAnswer(char, key));
        } else {
          key.classList.add("disabled");
        }

        rowDiv.appendChild(key);
      });

      keyboard.appendChild(rowDiv);
    });
  }

  nextQuestion() {
    this.isLocked = false;

    // Pick target letter
    if (this.levelData.levelNumber === 1) {
      // Alternate E and T for level 1
      this.currentLetter = this.levelData.letters[this.levelOneAlternator % 2];
      this.levelOneAlternator++;
    } else {
      // Weighted random favoring new letters slightly
      const pool = [...this.levelData.letters];
      if (this.levelData.newLetters && this.levelData.newLetters.length > 0) {
        pool.push(...this.levelData.newLetters);
      }
      this.currentLetter = pool[Math.floor(Math.random() * pool.length)];
    }

    document.getElementById("advSignalDots").textContent = "• • •";
    document.getElementById("advFeedback").textContent = "Nhấn [Nghe Tín Hiệu] hoặc Phím Space để nghe!";

    // Automatically play the Morse sound
    setTimeout(() => {
      this.playCurrentMorse();
    }, 250);
  }

  playCurrentMorse() {
    if (!this.currentLetter) return;
    const code = MORSE[this.currentLetter];
    soundEngine.playMorse(code);
  }

  handleAnswer(selectedChar, btnEl) {
    if (this.isLocked) return;
    soundEngine.init();

    this.tries++;
    storage.data.totalQuestions++;

    if (selectedChar === this.currentLetter) {
      // Correct!
      this.isLocked = true;
      this.score++;
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      storage.data.correctQuestions++;
      storage.addXp(10 + this.combo * 2);

      if (btnEl) btnEl.classList.add("correct-burst");
      soundEngine.playSuccessChime();

      // Check combo badges
      if (this.combo >= 5) storage.unlockBadge("streak_5");
      if (this.combo >= 15) storage.unlockBadge("streak_15");

      document.getElementById("advSignalDots").textContent = `${this.currentLetter} = ${formatMorseSymbols(MORSE[this.currentLetter])}`;
      document.getElementById("advFeedback").textContent = `Chính xác! Chuỗi: ${this.combo} 🔥`;
      visualEngine.setMascotState(`Xuất sắc! Bạn đoán đúng chữ ${this.currentLetter}!`, "cheer");

      this.currentQuestionIndex++;
      this.updateProgress();

      // Check for early victory in boss challenge with 15 combo
      if (this.levelData.type === "challenge" && this.combo >= 15) {
        setTimeout(() => this.finishLevel(true), 800);
        return;
      }

      // Check if target questions completed
      if (this.currentQuestionIndex >= this.targetQuestionCount) {
        setTimeout(() => this.finishLevel(false), 800);
        return;
      }

      setTimeout(() => {
        if (btnEl) btnEl.classList.remove("correct-burst");
        this.nextQuestion();
      }, 750);

    } else {
      // Wrong!
      this.combo = 0;
      soundEngine.playWrongBoop();
      if (btnEl) btnEl.classList.add("wrong-burst");
      visualEngine.setMascotState(`Ôi suýt đúng! Hãy nghe lại chữ ${this.currentLetter} nhé!`, "oops");

      document.getElementById("advFeedback").textContent = `Chưa đúng rồi! Hãy thử lại câu này nhé.`;

      if (this.levelData.type === "challenge") {
        this.hearts--;
        this.updateHeartsDisplay();
        if (this.hearts <= 0) {
          this.gameOverChallenge();
          return;
        }
      }

      setTimeout(() => {
        if (btnEl) btnEl.classList.remove("wrong-burst");
        this.playCurrentMorse();
      }, 700);
    }
  }

  updateHeartsDisplay() {
    const heartsEl = document.getElementById("advHearts");
    if (heartsEl) {
      heartsEl.textContent = "❤️".repeat(this.hearts) + "🖤".repeat(3 - this.hearts);
    }
  }

  updateProgress() {
    const progressEl = document.getElementById("advProgressText");
    const fillEl = document.getElementById("advProgressFill");
    const pct = Math.min(100, Math.round((this.currentQuestionIndex / this.targetQuestionCount) * 100));

    if (progressEl) progressEl.textContent = `${this.currentQuestionIndex} / ${this.targetQuestionCount}`;
    if (fillEl) fillEl.style.width = `${pct}%`;
  }

  finishLevel(isEarlyPassed = false) {
    const accuracy = this.tries > 0 ? Math.round((this.score / this.tries) * 100) : 100;
    const isSuccess = isEarlyPassed || accuracy >= 80;

    if (isSuccess) {
      // Calculate Stars
      let stars = 1;
      if (accuracy >= 95 || isEarlyPassed) stars = 3;
      else if (accuracy >= 85) stars = 2;

      storage.setLevelStars(this.levelData.levelNumber, stars);
      storage.unlockNextLevel(this.levelData.levelNumber);

      if (accuracy === 100) storage.unlockBadge("perfect_run");
      if (this.levelData.type === "challenge") storage.unlockBadge("boss_slayer");

      visualEngine.launchConfetti();
      soundEngine.playLevelUpFanfare();

      this.showCompleteModal(true, stars, accuracy, isEarlyPassed);
    } else {
      this.showCompleteModal(false, 0, accuracy, false);
    }
  }

  gameOverChallenge() {
    this.isLocked = true;
    soundEngine.playWrongBoop();
    this.showCompleteModal(false, 0, 0, false, "Bạn đã hết tim trong thử thách Boss!");
  }

  showCompleteModal(isSuccess, stars, accuracy, isEarly, customMsg = "") {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";

    const starIcons = "⭐".repeat(stars) + "☆".repeat(3 - stars);
    const title = isSuccess ? "CHIẾN THẮNG MÀN HỌC! 🚀" : "CHƯA HOÀN THÀNH";
    const icon = isSuccess ? "🏆" : "💪";
    const desc = customMsg || (isSuccess
      ? `Độ chính xác: ${accuracy}% · Chuỗi cao nhất: ${this.maxCombo}${isEarly ? " (Vượt sớm nhờ 15 combo!)" : ""}`
      : `Độ chính xác đạt ${accuracy}%. Cần tối thiểu 80% để mở khóa màn tiếp theo!`);

    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-icon">${icon}</div>
        <div class="modal-title">${title}</div>
        ${isSuccess ? `<div style="font-size: 2rem; color: var(--neon-amber); margin-bottom: 12px;">${starIcons}</div>` : ""}
        <p class="modal-desc">${desc}</p>
        <div class="modal-actions">
          <button class="btn btn-ghost" id="advBackToMapBtn">🗺️ Bản Đồ Cấp Độ</button>
          <button class="btn btn-primary" id="advReplayLevelBtn">↻ ${isSuccess ? "Luyện Lại" : "Thử Lại Ngay"}</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector("#advBackToMapBtn").addEventListener("click", () => {
      modal.remove();
      this.returnToLevelMap();
    });

    modal.querySelector("#advReplayLevelBtn").addEventListener("click", () => {
      modal.remove();
      this.startLevel(this.currentLevelIndex);
    });
  }

  returnToLevelMap() {
    document.getElementById("adventurePlayView").classList.add("hidden");
    document.getElementById("levelSelectView").classList.remove("hidden");
    this.renderLevelMap();
  }
}

// Global Adventure Mode Instance
const adventureGame = new AdventureMode();
