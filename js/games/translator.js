/* ==========================================================================
   MORSE SPACE CADET - TRANSLATOR & BROADCASTER
   ========================================================================== */

class TranslatorMode {
  constructor() {
    this.textInputEl = null;
    this.morseInputEl = null;
    this.isBroadcasting = false;
  }

  init() {
    this.textInputEl = document.getElementById("transTextInput");
    this.morseInputEl = document.getElementById("transMorseInput");

    if (this.textInputEl) {
      this.textInputEl.addEventListener("input", () => this.handleTextChange());
    }

    if (this.morseInputEl) {
      this.morseInputEl.addEventListener("input", () => this.handleMorseChange());
    }

    const broadcastBtn = document.getElementById("transBroadcastBtn");
    if (broadcastBtn) {
      broadcastBtn.addEventListener("click", () => this.handleBroadcast());
    }

    const stopBtn = document.getElementById("transStopBtn");
    if (stopBtn) {
      stopBtn.addEventListener("click", () => this.stopBroadcast());
    }

    const copyBtn = document.getElementById("transCopyMorseBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => this.copyMorseToClipboard());
    }

    // Quick preset buttons
    const presetBtns = document.querySelectorAll(".trans-preset-btn");
    presetBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = btn.getAttribute("data-text");
        if (this.textInputEl) {
          this.textInputEl.value = text;
          this.handleTextChange();
        }
      });
    });
  }

  // Remove Vietnamese accents and special marks for standard Morse encoding
  removeAccents(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  handleTextChange() {
    const rawText = this.textInputEl.value.trim().toUpperCase();
    const cleanText = this.removeAccents(rawText);

    if (!cleanText) {
      this.morseInputEl.value = "";
      return;
    }

    const words = cleanText.split(/\s+/);
    const morseWords = words.map((w) => {
      return [...w]
        .map((char) => MORSE[char] || "")
        .filter(Boolean)
        .join(" ");
    });

    this.morseInputEl.value = morseWords.join(" / ");
  }

  handleMorseChange() {
    const rawMorse = this.morseInputEl.value.trim();
    if (!rawMorse) {
      this.textInputEl.value = "";
      return;
    }

    // Replace unicode dot/dash with standard ./ -
    const standardMorse = rawMorse.replaceAll("•", ".").replaceAll("—", "-");
    const words = standardMorse.split(/\s*\/\s*|\s*\|\s*/);

    const textWords = words.map((w) => {
      const letters = w.split(/\s+/);
      return letters
        .map((code) => REVERSE_MORSE[code] || "?")
        .join("");
    });

    this.textInputEl.value = textWords.join(" ");
  }

  handleBroadcast() {
    const morseCode = this.morseInputEl.value.trim();
    if (!morseCode) {
      visualEngine.setMascotState("Hãy nhập tin nhắn trước khi phát sóng nhé!", "thinking");
      return;
    }

    this.isBroadcasting = true;
    storage.unlockBadge("broadcaster");
    visualEngine.setMascotState("Đang phát sóng tín hiệu Morse ra toàn trạm vũ trụ...", "hero");

    const standardCode = morseCode.replaceAll("•", ".").replaceAll("—", "-");
    soundEngine.playMorse(standardCode);
  }

  stopBroadcast() {
    this.isBroadcasting = false;
    soundEngine.stopSequence();
    visualEngine.setMascotState("Đã dừng phát sóng tín hiệu!", "happy");
  }

  copyMorseToClipboard() {
    const code = this.morseInputEl.value.trim();
    if (!code) return;

    navigator.clipboard.writeText(code).then(() => {
      visualEngine.setMascotState("Đã sao chép mã Morse vào bộ nhớ tạm! Bạn có thể dán để gửi cho bạn bè!", "cheer");
      soundEngine.playSuccessChime();
    });
  }
}

// Global Translator Instance
const translatorGame = new TranslatorMode();
