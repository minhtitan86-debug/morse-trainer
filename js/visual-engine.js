/* ==========================================================================
   MORSE SPACE CADET - VISUAL ENGINE (MASCOT, BEACON & CONFETTI)
   ========================================================================== */

class VisualEngine {
  constructor() {
    this.beaconEl = null;
    this.mascotMsgEl = null;
    this.mascotBotEl = null;
    this.confettiCanvas = null;
    this.confettiCtx = null;
    this.particles = [];
    this.animId = null;
  }

  init() {
    this.beaconEl = document.getElementById("beaconLamp");
    this.mascotMsgEl = document.getElementById("mascotMsg");
    this.mascotBotEl = document.getElementById("mascotBot");
    this.confettiCanvas = document.getElementById("confettiCanvas");

    if (this.confettiCanvas) {
      this.confettiCtx = this.confettiCanvas.getContext("2d");
      this.resizeCanvas();
      window.addEventListener("resize", () => this.resizeCanvas());
    }

    // Connect audio engine callbacks to beacon visual flash
    soundEngine.onToneStart = () => this.setBeaconFlash(true);
    soundEngine.onToneEnd = () => this.setBeaconFlash(false);
  }

  resizeCanvas() {
    if (!this.confettiCanvas) return;
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;
  }

  /* ==========================================================================
     BEACON FLASHLIGHT
     ========================================================================== */
  setBeaconFlash(isFlashing) {
    if (!this.beaconEl) return;
    if (isFlashing) {
      this.beaconEl.classList.add("flashing");
    } else {
      this.beaconEl.classList.remove("flashing");
    }
  }

  /* ==========================================================================
     MASCOT BEEP-BOT
     ========================================================================== */
  setMascotState(message, emotion = "happy") {
    if (this.mascotMsgEl) {
      this.mascotMsgEl.textContent = message;
      this.mascotMsgEl.classList.remove("anim-pop");
      void this.mascotMsgEl.offsetWidth; // Trigger reflow
      this.mascotMsgEl.classList.add("anim-pop");
    }

    if (this.mascotBotEl) {
      // Set robot avatar emoji/icon
      const icons = {
        happy: "🤖",
        cheer: "🥳",
        thinking: "🧐",
        oops: "😅",
        dance: "🚀",
        hero: "⭐"
      };
      this.mascotBotEl.textContent = icons[emotion] || "🤖";
    }
  }

  /* ==========================================================================
     CANVAS CONFETTI PARTICLE SYSTEM (Zero Dependency)
     ========================================================================== */
  launchConfetti(durationMs = 2500) {
    if (!this.confettiCanvas || !this.confettiCtx) return;
    this.resizeCanvas();

    const colors = ["#00f0ff", "#ffb703", "#ff2a85", "#06d6a0", "#ffd166", "#9d4edd", "#ffffff"];
    const count = 120;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 300,
        y: window.innerHeight * 0.45,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 1.2) * 18,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        shape: Math.random() > 0.4 ? "rect" : "circle",
        alpha: 1,
        decay: Math.random() * 0.008 + 0.006
      });
    }

    if (!this.animId) {
      this._animateConfetti();
    }
  }

  _animateConfetti() {
    if (!this.confettiCtx) return;
    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // Gravity
      p.rotation += p.vRot;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > window.innerHeight + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.confettiCtx.save();
      this.confettiCtx.globalAlpha = Math.max(0, p.alpha);
      this.confettiCtx.translate(p.x, p.y);
      this.confettiCtx.rotate((p.rotation * Math.PI) / 180);
      this.confettiCtx.fillStyle = p.color;

      if (p.shape === "rect") {
        this.confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        this.confettiCtx.beginPath();
        this.confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.confettiCtx.fill();
      }

      this.confettiCtx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this._animateConfetti());
    } else {
      this.animId = null;
      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    }
  }
}

// Global Visual Engine Instance
const visualEngine = new VisualEngine();
