let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtube-frame", {
    videoId: "vr9dLvJs7VE",
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: "vr9dLvJs7VE"
    },
    events: {
      onReady: () => {
        player.setVolume(1); // 初期音量（作業中）
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const workVideoId = "vr9dLvJs7VE";
  const breakVideoId = "To1yijqZCCE";

  const timerElement = document.getElementById("timer");
  const todoElement = document.querySelector(".todo");
  const breakText = document.querySelector(".time-break");

  const alarmStartSelect = document.getElementById("alarm-start-select");
  const alarmEndSelect = document.getElementById("alarm-end-select");
  const volumeControl = document.getElementById("volume-control");
  const muteToggle = document.getElementById("mute-toggle");
  const testStartBtn = document.getElementById("test-start");
  const testEndBtn = document.getElementById("test-end");
  const stopStartBtn = document.getElementById("stop-start");
  const stopEndBtn = document.getElementById("stop-end");

  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");

  const fileMap = {
    alarm: "alarm.mp3",
    DJ: "DJ.mp3",
    dora: "dora.mp3",
    clock: "clock.mp3",
    clapboard: "clapboard.mp3",
    "historical-drama": "historical-drama.mp3",
    up: "up.mp3",
    curse: "curse.mp3",
    ramen: "ramen.mp3",
    bugle: "bugle.mp3",
    flash: "flash.mp3",
    voice1: "voice1.mp3",
    voice2: "voice2.mp3",
    voice3: "voice3.mp3",
    voice4: "voice4.mp3",
    voice5: "voice5.mp3",
    voice6: "voice6.mp3",
    voice7: "voice7.mp3",
    voice8: "voice8.mp3",
    voice9: "voice9.mp3",
    voice10: "voice10.mp3",
    voice11: "voice11.mp3",
    voice12: "voice12.mp3",
    voice13: "voice13.mp3",
    voice14: "voice14.mp3",
    voice15: "voice15.mp3",
    voice16: "voice16.mp3"
  };

  const audioStart = new Audio();
  const audioEnd = new Audio();
  audioStart.volume = 0.1;
  audioEnd.volume = 0.1;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const task = input.value.trim();
    if (!task) return;
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" />
      <span>${task}</span>
      <button class="delete-btn">削除</button>
    `;
    list.appendChild(li);
    input.value = "";
  });

  list.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      e.target.closest("li").remove();
    }
  });

  function updateTimer() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const isWorkTime = minutes % 60 < 50;

    const remaining = isWorkTime
      ? (49 - minutes % 60) * 60 + (59 - seconds)
      : (59 - minutes % 60) * 60 + (59 - seconds);

    const displayMinutes = String(Math.floor(remaining / 60)).padStart(2, "0");
    const displaySeconds = String(remaining % 60).padStart(2, "0");
    timerElement.textContent = `${displayMinutes}:${displaySeconds}`;

    const targetVideoId = isWorkTime ? workVideoId : breakVideoId;
    const currentVideoId = player && player.getVideoData().video_id;

    if (player && currentVideoId !== targetVideoId) {
      player.loadVideoById({
        videoId: targetVideoId,
        suggestedQuality: "large"
      });

      setTimeout(() => {
        player.setVolume(isWorkTime ? 10 : 3); // ✅ 作業中:10, 休憩中:3
      }, 800);

      playAlarm(isWorkTime ? "start" : "end");
    }

    // UI表示切替
    if (isWorkTime) {
      timerElement.classList.remove("timer--top-left");
      if (todoElement) todoElement.style.display = "";
      if (breakText) breakText.style.display = "none";
    } else {
      timerElement.classList.add("timer--top-left");
      if (todoElement) todoElement.style.display = "none";
      if (breakText) breakText.style.display = "block";
    }
  }

  function playAlarm(type) {
    const selected = type === "start" ? alarmStartSelect.value : alarmEndSelect.value;
    const file = fileMap[selected];
    if (!file) return;

    const audio = type === "start" ? audioStart : audioEnd;
    audio.src = `./alarm/${file}`;
    audio.volume = volumeControl ? volumeControl.value : 0.03;
    audio.muted = muteToggle ? muteToggle.checked : false;
    audio.play();
  }

  if (volumeControl) {
    volumeControl.addEventListener("input", () => {
      audioStart.volume = volumeControl.value;
      audioEnd.volume = volumeControl.value;
    });
  }

  if (muteToggle) {
    muteToggle.addEventListener("change", () => {
      audioStart.muted = muteToggle.checked;
      audioEnd.muted = muteToggle.checked;
    });
  }

  if (testStartBtn) testStartBtn.addEventListener("click", () => playAlarm("start"));
  if (testEndBtn) testEndBtn.addEventListener("click", () => playAlarm("end"));
  if (stopStartBtn) stopStartBtn.addEventListener("click", () => {
    audioStart.pause();
    audioStart.currentTime = 0;
  });
  if (stopEndBtn) stopEndBtn.addEventListener("click", () => {
    audioEnd.pause();
    audioEnd.currentTime = 0;
  });

  updateTimer();
  setInterval(updateTimer, 1000);
});

// ✅ デバッグ用：手動で休憩モードに切り替え
window.toggleBreak = () => {
  const fakeNow = new Date();
  fakeNow.setMinutes(55); // 疑似的に休憩時間へ
  const originalGetMinutes = Date.prototype.getMinutes;
  Date.prototype.getMinutes = () => fakeNow.getMinutes();
  setTimeout(() => {
    Date.prototype.getMinutes = originalGetMinutes;
  }, 1000);
};
