/* ==========================================================================
   MORSE SPACE CADET - STORAGE & GAMIFICATION MANAGER
   ========================================================================== */

class StorageManager {
  constructor() {
    this.prefix = "morseSpace_";
    this.data = {
      unlockedLevel: 1,
      stars: {}, // { 1: 3, 2: 2, ... }
      xp: 0,
      streak: 1,
      lastActiveDate: new Date().toDateString(),
      badges: [],
      wordsDecodedCount: 0,
      keyerSuccessCount: 0,
      totalQuestions: 0,
      correctQuestions: 0,
      usedSkins: ["arcade"],
      settings: {
        soundSkin: "arcade",
        wpm: 14,
        frequency: 600,
        volume: 0.8
      }
    };
    this.load();
  }

  load() {
    try {
      // Check legacy values if upgrading from previous version
      const legacyLevel = localStorage.getItem("morseUnlockedLevel");
      const legacyStep = localStorage.getItem("morseUnlockedStep");
      const legacyWpm = localStorage.getItem("morseSpeedWpm");

      const saved = localStorage.getItem(this.prefix + "data");
      if (saved) {
        this.data = Object.assign(this.data, JSON.parse(saved));
      } else if (legacyStep || legacyLevel) {
        this.data.unlockedLevel = Number(legacyStep) || Number(legacyLevel) || 1;
        if (legacyWpm) this.data.settings.wpm = Number(legacyWpm);
      }

      // Check daily streak
      const today = new Date().toDateString();
      if (this.data.lastActiveDate !== today) {
        const lastDate = new Date(this.data.lastActiveDate);
        const diffDays = Math.round((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          this.data.streak += 1;
        } else if (diffDays > 1) {
          this.data.streak = 1;
        }
        this.data.lastActiveDate = today;
        this.save();
      }
    } catch (e) {
      console.warn("StorageManager load error:", e);
    }
  }

  save() {
    try {
      localStorage.setItem(this.prefix + "data", JSON.stringify(this.data));
    } catch (e) {
      console.warn("StorageManager save error:", e);
    }
  }

  addXp(amount) {
    this.data.xp += amount;
    this.save();
    this.updateHUD();
  }

  setLevelStars(levelNum, starCount) {
    const prev = this.data.stars[levelNum] || 0;
    if (starCount > prev) {
      this.data.stars[levelNum] = starCount;
      this.save();
    }
    this.checkStarBadge();
  }

  unlockNextLevel(currentLevelNum) {
    if (currentLevelNum >= this.data.unlockedLevel) {
      this.data.unlockedLevel = Math.min(LEVELS_LIST.length, currentLevelNum + 1);
      this.save();
    }

    if (this.data.unlockedLevel >= 1) {
      this.unlockBadge("cadet");
    }
    if (this.data.unlockedLevel >= 7) {
      this.unlockBadge("halfway");
    }
    if (this.data.unlockedLevel >= LEVELS_LIST.length) {
      this.unlockBadge("all_letters");
    }
  }

  unlockBadge(badgeId) {
    if (!this.data.badges.includes(badgeId)) {
      this.data.badges.push(badgeId);
      this.save();

      const def = BADGES_DEF.find((b) => b.id === badgeId);
      if (def) {
        this.showBadgeModal(def);
        this.addXp(100);
      }
    }
  }

  checkStarBadge() {
    const totalStars = Object.values(this.data.stars).reduce((a, b) => a + b, 0);
    if (totalStars >= 15) {
      this.unlockBadge("star_collector");
    }
  }

  recordUsedSkin(skinName) {
    if (!this.data.usedSkins.includes(skinName)) {
      this.data.usedSkins.push(skinName);
      if (this.data.usedSkins.length >= 4) {
        this.unlockBadge("sound_explorer");
      }
      this.save();
    }
  }

  showBadgeModal(badge) {
    visualEngine.launchConfetti();
    soundEngine.playLevelUpFanfare();

    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-icon">${badge.icon}</div>
        <div class="modal-title">Huy Hiệu Mới Mở Khóa!</div>
        <h3 style="color: var(--neon-amber); margin-bottom: 8px;">${badge.title}</h3>
        <p class="modal-desc">${badge.desc}</p>
        <p style="color: var(--neon-cyan); font-weight: 800; margin-bottom: 16px;">+100 XP Thưởng</p>
        <button class="btn btn-primary" id="closeBadgeModalBtn">Tuyệt Vời! 🚀</button>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector("#closeBadgeModalBtn").addEventListener("click", () => {
      modal.remove();
    });
  }

  updateHUD() {
    const xpEl = document.getElementById("hudXp");
    const streakEl = document.getElementById("hudStreak");
    if (xpEl) xpEl.textContent = `${this.data.xp} XP`;
    if (streakEl) streakEl.textContent = `${this.data.streak} ngày`;
  }
}

// Global Storage Manager Instance
const storage = new StorageManager();
