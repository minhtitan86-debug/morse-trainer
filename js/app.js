/* ==========================================================================
   MORSE SPACE CADET - MAIN APPLICATION CONTROLLER
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Engines
  visualEngine.init();
  storage.updateHUD();

  // Apply saved audio settings
  soundEngine.setSkin(storage.data.settings.soundSkin || "arcade");
  soundEngine.setWpm(storage.data.settings.wpm || 14);
  soundEngine.setFrequency(storage.data.settings.frequency || 600);

  // Sync HUD Skin dropdown
  const skinSelect = document.getElementById("hudSkinSelect");
  if (skinSelect) {
    skinSelect.value = soundEngine.currentSkin;
    skinSelect.addEventListener("change", (e) => {
      const newSkin = e.target.value;
      soundEngine.setSkin(newSkin);
      storage.data.settings.soundSkin = newSkin;
      storage.recordUsedSkin(newSkin);
      storage.save();
      soundEngine.playSuccessChime();
    });
  }

  // 2. Initialize Game Modes
  adventureGame.init();
  sendingGame.init();
  wordDecoderGame.init();
  translatorGame.init();
  flashcardsGame.init();

  // 3. Tab Navigation Wiring
  const tabButtons = document.querySelectorAll(".nav-tabs .tab-btn");
  const views = {
    tabAdventure: document.getElementById("viewAdventure"),
    tabSending: document.getElementById("viewSending"),
    tabWordDecoder: document.getElementById("viewWordDecoder"),
    tabTranslator: document.getElementById("viewTranslator"),
    tabFlashcards: document.getElementById("viewFlashcards")
  };

  tabButtons.forEach((tab) => {
    tab.addEventListener("click", () => {
      soundEngine.playClickTap();
      const targetViewKey = tab.id;

      // Update active tab button
      tabButtons.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Switch view visibility
      Object.values(views).forEach((view) => {
        if (view) view.classList.add("hidden");
      });

      if (views[targetViewKey]) {
        views[targetViewKey].classList.remove("hidden");
      }

      // Handle mode specific initializations
      if (targetViewKey === "tabAdventure") {
        adventureGame.renderLevelMap();
      } else if (targetViewKey === "tabSending") {
        sendingGame.setMode(sendingGame.mode);
      } else if (targetViewKey === "tabWordDecoder") {
        if (!wordDecoderGame.wordData) wordDecoderGame.startNewWord();
      } else if (targetViewKey === "tabFlashcards") {
        flashcardsGame.renderGrid();
      }
    });
  });

  // 4. Adventure Mode Sub-Buttons
  const advReplayAudioBtn = document.getElementById("advReplayAudioBtn");
  if (advReplayAudioBtn) {
    advReplayAudioBtn.addEventListener("click", () => {
      adventureGame.playCurrentMorse();
    });
  }

  const advBackToMapTopBtn = document.getElementById("advBackToMapTopBtn");
  if (advBackToMapTopBtn) {
    advBackToMapTopBtn.addEventListener("click", () => {
      adventureGame.returnToLevelMap();
    });
  }

  // 5. Badges Trophy Cabinet Button
  const badgesBtn = document.getElementById("hudBadgesBtn");
  if (badgesBtn) {
    badgesBtn.addEventListener("click", () => {
      soundEngine.playClickTap();
      showBadgesCabinet();
    });
  }

  // 6. Settings Modal Button
  const settingsBtn = document.getElementById("hudSettingsBtn");
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      soundEngine.playClickTap();
      showSettingsModal();
    });
  }

  // 7. Global Keyboard Shortcuts Handler
  window.addEventListener("keydown", (e) => {
    // Ignore input if user is typing in translator textareas
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") {
      return;
    }

    const key = e.key.toUpperCase();

    // SPACEBAR handler
    if (e.code === "Space") {
      e.preventDefault();
      // If in Sending Mode -> Keyer Down
      if (!views.tabSending.classList.contains("hidden")) {
        sendingGame.handleKeyDown();
      }
      // If in Adventure Quiz -> Replay Audio
      else if (!document.getElementById("adventurePlayView").classList.contains("hidden")) {
        adventureGame.playCurrentMorse();
      }
      return;
    }

    // Single letter keys (A-Z)
    if (/^[A-Z]$/.test(key)) {
      // In Adventure Play Mode
      if (!document.getElementById("adventurePlayView").classList.contains("hidden")) {
        const btn = document.getElementById(`advKey_${key}`);
        if (btn && !btn.classList.contains("disabled")) {
          adventureGame.handleAnswer(key, btn);
        }
      }
      // In Word Decoder Mode
      else if (!views.tabWordDecoder.classList.contains("hidden")) {
        wordDecoderGame.handleKeyClick(key, null);
      }
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
      if (!views.tabSending.classList.contains("hidden")) {
        sendingGame.handleKeyUp();
      }
    }
  });

  // Welcome Mascot Greeting
  visualEngine.setMascotState("Chào mừng bạn đến với Morse Space Cadet! Hãy chọn một chế độ để bắt đầu khám phá!", "happy");
});

/* ==========================================================================
   BADGES TROPHY CABINET MODAL
   ========================================================================== */
function showBadgesCabinet() {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";

  const totalBadges = BADGES_DEF.length;
  const unlockedCount = storage.data.badges.length;

  let badgesHtml = "";
  BADGES_DEF.forEach((badge) => {
    const isUnlocked = storage.data.badges.includes(badge.id);
    badgesHtml += `
      <div class="badge-item ${isUnlocked ? "unlocked" : "locked"}">
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-title">${badge.title}</div>
        <div class="badge-desc">${badge.desc}</div>
        <div style="font-size: 0.75rem; font-weight:800; color: ${isUnlocked ? "var(--neon-green)" : "var(--text-muted)"}">
          ${isUnlocked ? "✓ Đã mở" : "🔒 Chưa đạt"}
        </div>
      </div>
    `;
  });

  modal.innerHTML = `
    <div class="modal-box" style="max-width: 680px; max-height: 88vh; overflow-y: auto;">
      <div class="modal-title">🏆 Tủ Danh Hiệu Của Bạn</div>
      <p class="modal-desc">Đã mở khóa: <strong>${unlockedCount} / ${totalBadges}</strong> danh hiệu</p>
      <div class="badge-grid" style="margin-bottom: 24px;">
        ${badgesHtml}
      </div>
      <button class="btn btn-primary" id="closeCabinetBtn">Đóng</button>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector("#closeCabinetBtn").addEventListener("click", () => modal.remove());
}

/* ==========================================================================
   SETTINGS MODAL
   ========================================================================== */
function showSettingsModal() {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";

  modal.innerHTML = `
    <div class="modal-box" style="max-width: 480px; text-align: left;">
      <div class="modal-title" style="text-align: center; margin-bottom: 18px;">⚙️ Cài Đặt Không Gian</div>
      
      <div style="margin-bottom: 16px;">
        <label style="display: flex; justify-content: space-between; font-weight: 800; margin-bottom: 6px;">
          <span>⚡ Tốc Độ Phát (WPM):</span>
          <span id="setWpmValue" style="color: var(--neon-cyan);">${soundEngine.wpm} WPM</span>
        </label>
        <input type="range" id="setWpmRange" min="8" max="26" value="${soundEngine.wpm}" style="width: 100%; accent-color: var(--neon-cyan);">
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">Người mới nên để 10-14 WPM; quen tai có thể tăng 18-24 WPM.</div>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: flex; justify-content: space-between; font-weight: 800; margin-bottom: 6px;">
          <span>🎵 Tần Số Âm Thanh (Hz):</span>
          <span id="setToneValue" style="color: var(--neon-amber);">${soundEngine.frequency} Hz</span>
        </label>
        <input type="range" id="setToneRange" min="400" max="850" step="25" value="${soundEngine.frequency}" style="width: 100%; accent-color: var(--neon-amber);">
      </div>

      <div style="margin-bottom: 24px;">
        <button class="btn btn-danger btn-sm" id="resetProgressBtn" style="width: 100%;">⚠️ Xóa và Đặt Lại Tiến Trình</button>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-primary" id="saveSettingsBtn">Lưu & Đóng</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const wpmRange = modal.querySelector("#setWpmRange");
  const wpmVal = modal.querySelector("#setWpmValue");
  wpmRange.addEventListener("input", (e) => {
    wpmVal.textContent = `${e.target.value} WPM`;
  });

  const toneRange = modal.querySelector("#setToneRange");
  const toneVal = modal.querySelector("#setToneValue");
  toneRange.addEventListener("input", (e) => {
    toneVal.textContent = `${e.target.value} Hz`;
  });

  modal.querySelector("#resetProgressBtn").addEventListener("click", () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ tiến trình học và các huy hiệu đã mở?")) {
      localStorage.clear();
      location.reload();
    }
  });

  modal.querySelector("#saveSettingsBtn").addEventListener("click", () => {
    const newWpm = Number(wpmRange.value);
    const newTone = Number(toneRange.value);

    soundEngine.setWpm(newWpm);
    soundEngine.setFrequency(newTone);

    storage.data.settings.wpm = newWpm;
    storage.data.settings.frequency = newTone;
    storage.save();

    soundEngine.playSuccessChime();
    modal.remove();
  });
}
