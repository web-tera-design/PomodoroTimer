document.addEventListener("DOMContentLoaded", () => {
  const workVideoId = "vr9dLvJs7VE";
  const breakVideoId = "To1yijqZCCE";

  const iframe = document.getElementById("youtube-frame");
  const timerElement = document.getElementById("timer");
  const todoElement = document.querySelector(".todo");
  const breakLabel = document.getElementById("break-label");
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
  audioStart.volume = 0.3;
  audioEnd.volume = 0.3;

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

  function updateTimer(forcedNow = null) {
    const now = forcedNow || new Date();
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

    if (isWorkTime) {
      timerElement.classList.remove("timer--top-left");
      if (todoElement) todoElement.style.display = "";
      if (breakLabel) breakLabel.style.display = "none";
      if (breakText) breakText.style.display = "none";
    } else {
      timerElement.classList.add("timer--top-left");
      if (todoElement) todoElement.style.display = "none";
      if (breakLabel) breakLabel.style.display = "block";
      if (breakText) breakText.style.display = "block";
    }
  }

  function playAlarm(type) {
    const selected = type === "start" ? alarmStartSelect.value : alarmEndSelect.value;
    const file = fileMap[selected];
    if (!file) return;

    const audio = type === "start" ? audioStart : audioEnd;
    audio.src = `./alarm/${file}`;
    audio.volume = volumeControl ? volumeControl.value : 0.3;
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
  setInterval(() => updateTimer(), 1000);
});

window.toggleBreak = () => {
  const now = new Date();
  now.setMinutes(55);
  updateTimer(now);
  console.log("✅ 休憩時間に強制切り替えました");
};
