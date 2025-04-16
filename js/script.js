document.addEventListener("DOMContentLoaded", () => {
  const workVideoId = "vr9dLvJs7VE";
  const breakVideoId = "uLtKtTVoNPI";
  const iframe = document.getElementById("youtube-frame");
  const timerElement = document.getElementById("timer");

  // ▼ アラーム設定
  const alarmStartSelect = document.getElementById("alarm-start-select");
  const alarmEndSelect = document.getElementById("alarm-end-select");
  const volumeControl = document.getElementById("volume-control");
  const muteToggle = document.getElementById("mute-toggle");
  const testStartBtn = document.getElementById("test-start");
  const testEndBtn = document.getElementById("test-end");
  const stopStartBtn = document.getElementById("stop-start");
  const stopEndBtn = document.getElementById("stop-end");

  // ▼ ToDo
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");

  // ▼ アラームファイルマップ
  const fileMap = {
    "alarm": "alarm.mp3",
    "DJ": "DJ.mp3",
    "dora": "dora.mp3",
    "clock": "clock.mp3",
    "clapboard": "clapboard.mp3",
    "historical-drama": "historical-drama.mp3",
    "up": "up.mp3",
    "curse": "curse.mp3",
    "ramen": "ramen.mp3",
    "bugle": "bugle.mp3",
    "flash": "flash.mp3"
  };

  const audioStart = new Audio();
  const audioEnd = new Audio();

  // ▼ ToDo追加
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

  // ▼ ToDo削除
  list.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      e.target.closest("li").remove();
    }
  });

  // ▼ タイマーと動画切り替え
  function updateTimer() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const isWorkTime = minutes % 60 < 50;

    const remaining = isWorkTime
      ? (49 - (minutes % 60)) * 60 + (59 - seconds)
      : (59 - (minutes % 60)) * 60 + (59 - seconds);

    const displayMinutes = String(Math.floor(remaining / 60)).padStart(2, "0");
    const displaySeconds = String(remaining % 60).padStart(2, "0");
    timerElement.textContent = `${displayMinutes}:${displaySeconds}`;

    const targetVideoId = isWorkTime ? workVideoId : breakVideoId;
    const currentSrc = iframe.src;

    if (!currentSrc.includes(targetVideoId)) {
      iframe.src = `https://www.youtube.com/embed/${targetVideoId}?autoplay=1&loop=1&playlist=${targetVideoId}`;
      playAlarm(isWorkTime ? "start" : "end");
    }
  }

  // ▼ アラーム再生
  function playAlarm(type) {
    const selected = type === "start" ? alarmStartSelect.value : alarmEndSelect.value;
    const file = fileMap[selected];
    if (!file) return;

    const audio = type === "start" ? audioStart : audioEnd;
    audio.src = `./alarm/${file}`;
    audio.volume = volumeControl ? volumeControl.value : 1;
    audio.muted = muteToggle ? muteToggle.checked : false;
    audio.play();
  }

  // ▼ 音量変更
  if (volumeControl) {
    volumeControl.addEventListener("input", () => {
      audioStart.volume = volumeControl.value;
      audioEnd.volume = volumeControl.value;
    });
  }

  // ▼ ミュート切替
  if (muteToggle) {
    muteToggle.addEventListener("change", () => {
      audioStart.muted = muteToggle.checked;
      audioEnd.muted = muteToggle.checked;
    });
  }

  // ▼ テスト再生
  if (testStartBtn) testStartBtn.addEventListener("click", () => playAlarm("start"));
  if (testEndBtn) testEndBtn.addEventListener("click", () => playAlarm("end"));

  // ▼ 停止ボタン
  if (stopStartBtn) stopStartBtn.addEventListener("click", () => {
    audioStart.pause();
    audioStart.currentTime = 0;
  });

  if (stopEndBtn) stopEndBtn.addEventListener("click", () => {
    audioEnd.pause();
    audioEnd.currentTime = 0;
  });

  // ✅ 最初に1回実行して0:00回避！
  updateTimer();

  // ✅ タイマー更新ループ
  setInterval(updateTimer, 1000);
});
