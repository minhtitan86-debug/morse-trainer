/* ==========================================================================
   MORSE SPACE CADET - SENDING MODE (TELEGRAPH KEYER)
   ========================================================================== */

class SendingMode {
  constructor() {
    this.mode = "learn"; // 'learn' or 'challenge'
    this.currentTarget = "E";
    this.currentMarks = [];
    this.pressStartTime = 0;
    this.isPressed = false;
    this.gapTimer = null;
    this.challengeIndex = 0;
    this.challengeScore = 0;
    this.challengeHearts = 3;
    this.challengeList = [];
  }

  init() {
    const keyBtn = document.getElementById("telegraphKeyBtn");
    if (!keyBtn) return;

    // Mouse events
    keyBtn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.handleKeyDown();
    });
    window.addEventListener("mouseup", () => this.handleKeyUp());

    // Touch events for mobile/tablet
    keyBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.handleKeyDown();
    }, { passive: false });

    keyBtn.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.handleKeyUp();
    });

    // Sub-mode switch buttons
    const learnBtn = document.getElementById("sendingSubLearnBtn");
    const challengeBtn = document.getElementById("sendingSubChallengeBtn");

    if (learnBtn) {
      learnBtn.addEventListener("click", () => {
        learnBtn.classList.add("active");
        if (challengeBtn) challengeBtn.classList.remove("active");
        this.setMode("learn");
      });
    }

    if (challengeBtn) {
      challengeBtn.addEventListener("click", () => {
        challengeBtn.classList.add("active");
        if (learnBtn) learnBtn.classList.remove("active");
        this.setMode("challenge");
      });
    }

    // Sample audio button
    const sampleBtn = document.getElementById("sendingSampleAudioBtn");
    if (sampleBtn) {
      sampleBtn.addEventListener("click", () => {
        const code = MORSE[this.currentTarget];
        soundEngine.playMorse(code);
      });
    }

    // Reset buffer button
    const resetBtn = document.getElementById("sendingResetBufferBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.currentMarks = [];
        this.updateReadout();
      });
    }
  }

  setMode(newMode) {
    this.mode = newMode;
    this.currentMarks = [];
    this.updateReadout();

    const hudEl = document.getElementById("sendingChallengeHud");
    if (newMode === "challenge") {
      hudEl.classList.remove("hidden");
      this.startChallenge();
    } else {
      hudEl.classList.add("hidden");
      this.nextLearnTarget();
    }
  }

  nextLearnTarget() {
    const letters = Object.keys(MORSE).filter((k) => k.length === 1 && /[A-Z]/.test(k));
    this.currentTarget = letters[Math.floor(Math.random() * letters.length)];
    this.updateTargetDisplay();
    visualEngine.setMascotState(`Hãy gõ chữ ${this.currentTarget} (${formatMorseSymbols(MORSE[this.currentTarget])}) nào!`, "cheer");
  }

  startChallenge() {
    const letters = ["E", "T", "A", "N", "I", "M", "S", "O", "R", "K"];
    this.challengeList = [...letters].sort(() => Math.random() - 0.5);
    this.challengeIndex = 0;
    this.challengeScore = 0;
    this.challengeHearts = 3;
    this.currentTarget = this.challengeList[0];
    this.updateTargetDisplay();
    this.updateChallengeHearts();
    document.getElementById("sendingProgressText").textContent = `1 / ${this.challengeList.length}`;
  }

  updateTargetDisplay() {
    const letterEl = document.getElementById("sendingTargetLetter");
    const hintEl = document.getElementById("sendingTargetHint");
    if (letterEl) letterEl.textContent = this.currentTarget;
    if (hintEl) hintEl.textContent = formatMorseSymbols(MORSE[this.currentTarget]);
  }

  updateChallengeHearts() {
    const heartsEl = document.getElementById("sendingHearts");
    if (heartsEl) {
      heartsEl.textContent = "❤️".repeat(this.challengeHearts) + "🖤".repeat(3 - this.challengeHearts);
    }
  }

  handleKeyDown() {
    if (this.isPressed) return;
    this.isPressed = true;
    this.pressStartTime = Date.now();

    if (this.gapTimer) {
      clearTimeout(this.gapTimer);
      this.gapTimer = null;
    }

    const keyBtn = document.getElementById("telegraphKeyBtn");
    if (keyBtn) keyBtn.classList.add("pressed");

    soundEngine.startTone();
  }

  handleKeyUp() {
    if (!this.isPressed) return;
    this.isPressed = false;

    const keyBtn = document.getElementById("telegraphKeyBtn");
    if (keyBtn) keyBtn.classList.remove("pressed");

    soundEngine.stopTone();

    const duration = Date.now() - this.pressStartTime;
    const ditThreshold = soundEngine.getDitDurationMs() * 2.0;

    // Detect Dot vs Dash
    const mark = duration < ditThreshold ? "." : "-";
    this.currentMarks.push(mark);
    this.updateReadout();

    // Schedule letter evaluation after inter-element gap (3 dits of silence)
    const letterGapMs = soundEngine.getDitDurationMs() * 3.2;
    this.gapTimer = setTimeout(() => {
      this.evaluateBufferedLetter();
    }, letterGapMs);
  }

  updateReadout() {
    const readoutEl = document.getElementById("sendingReadout");
    if (!readoutEl) return;

    if (this.currentMarks.length === 0) {
      readoutEl.textContent = "• • •";
    } else {
      readoutEl.textContent = formatMorseSymbols(this.currentMarks.join(""));
    }
  }

  evaluateBufferedLetter() {
    const code = this.currentMarks.join("");
    this.currentMarks = [];
    if (!code) return;

    const decodedLetter = REVERSE_MORSE[code] || "?";
    const feedbackEl = document.getElementById("sendingFeedbackMsg");

    if (decodedLetter === this.currentTarget) {
      // Success!
      soundEngine.playSuccessChime();
      storage.data.keyerSuccessCount = (storage.data.keyerSuccessCount || 0) + 1;
      storage.addXp(15);

      if (storage.data.keyerSuccessCount >= 5) {
        storage.unlockBadge("keyer_master");
      }

      if (feedbackEl) {
        feedbackEl.innerHTML = `<span style="color:var(--neon-green); font-weight:800;">Chính xác! Bạn vừa gửi chữ ${decodedLetter}! 🌟</span>`;
      }
      visualEngine.setMascotState(`Chuẩn từng nhịp! Bạn vừa phát chữ ${decodedLetter}!`, "cheer");

      if (this.mode === "challenge") {
        this.challengeScore++;
        this.challengeIndex++;
        if (this.challengeIndex >= this.challengeList.length) {
          this.finishChallenge();
          return;
        }
        document.getElementById("sendingProgressText").textContent = `${this.challengeIndex + 1} / ${this.challengeList.length}`;
        this.currentTarget = this.challengeList[this.challengeIndex];
        setTimeout(() => {
          this.updateTargetDisplay();
          this.updateReadout();
        }, 800);
      } else {
        setTimeout(() => {
          this.nextLearnTarget();
          this.updateReadout();
        }, 1200);
      }
    } else {
      // Wrong
      soundEngine.playWrongBoop();
      if (feedbackEl) {
        feedbackEl.innerHTML = `<span style="color:var(--neon-pink); font-weight:800;">Bạn vừa gõ: <strong>${decodedLetter}</strong> (${formatMorseSymbols(code)}). Cần gõ: <strong>${this.currentTarget}</strong> (${formatMorseSymbols(MORSE[this.currentTarget])})</span>`;
      }
      visualEngine.setMascotState(`Chưa khớp rồi! Hãy thử lại theo nhịp nhé!`, "oops");

      if (this.mode === "challenge") {
        this.challengeHearts--;
        this.updateChallengeHearts();
        if (this.challengeHearts <= 0) {
          this.gameOverChallenge();
        }
      }
    }
  }

  finishChallenge() {
    visualEngine.launchConfetti();
    soundEngine.playLevelUpFanfare();
    storage.addXp(150);

    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-icon">🏆</div>
        <div class="modal-title">HOÀN THÀNH THỬ THÁCH GÕ!</div>
        <p class="modal-desc">Bạn đã gõ chính xác cả 10 chữ cái của trạm phát sóng!</p>
        <p style="color:var(--neon-amber); font-weight:800; margin-bottom: 20px;">+150 XP Thưởng</p>
        <button class="btn btn-primary" id="sendingFinishBtn">Tuyệt Vời! 🚀</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#sendingFinishBtn").addEventListener("click", () => {
      modal.remove();
      this.setMode("learn");
    });
  }

  gameOverChallenge() {
    soundEngine.playWrongBoop();
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-icon">💔</div>
        <div class="modal-title">HẾT TIM RỒI!</div>
        <p class="modal-desc">Đừng nản lòng, hãy luyện tập thêm để bắt đúng nhịp nhé!</p>
        <button class="btn btn-primary" id="sendingRetryChallengeBtn">Thử Lại ↻</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#sendingRetryChallengeBtn").addEventListener("click", () => {
      modal.remove();
      this.startChallenge();
    });
  }
}

// Global Sending Mode Instance
const sendingGame = new SendingMode();
