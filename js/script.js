// ✅ YouTube IFrame APIでプレイヤーを制御
let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtube-frame", {
    videoId: "vr9dLvJs7VE",
    playerVars: {
      autoplay: 0,
      loop: 1,
      playlist: "vr9dLvJs7VE"
    },
    events: {
      onReady: () => {
        const youtubeVolumeSlider = document.getElementById("youtube-volume");
        const isWorkTime = new Date().getMinutes() % 60 < 50;

        const savedVolume = localStorage.getItem(
          isWorkTime ? "youtubeVolume_work" : "youtubeVolume_break"
        ) || (isWorkTime ? 1 : 1);

        player.setVolume(parseInt(savedVolume, 10));
        player.playVideo();

        if (youtubeVolumeSlider) {
          youtubeVolumeSlider.value = savedVolume;
          youtubeVolumeSlider.addEventListener("input", () => {
            const vol = parseInt(youtubeVolumeSlider.value, 10);
            player.setVolume(vol);
            localStorage.setItem(
              new Date().getMinutes() % 60 < 50 ? "youtubeVolume_work" : "youtubeVolume_break",
              vol
            );
          });
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const workVideoId = "vr9dLvJs7VE";
  const breakVideoId = "To1yijqZCCE";
  const lunchVideoId = "hZkOVN8qT8I";

  const timerElement = document.getElementById("timer");
  const todoElement = document.querySelector(".todo");
  const breakWrapper = document.querySelector(".time-break__wrapper");
  const breakText = document.querySelector(".time-break");
  const restartTimeText = document.getElementById("restart-time");

  // ✅ 音量スライダー群をJSで挿入
  const alarmUIWrapper = document.createElement("div");
  alarmUIWrapper.className = "alarm-ui";
  alarmUIWrapper.innerHTML = `
    <div class="alarm-volume-group">
      <label for="alarm-volume">アラーム音量</label>
      <input type="range" id="alarm-volume" min="0" max="1" step="0.01" value="0.5">
    </div>
    <div class="alarm-volume-group">
      <label for="youtube-volume">YouTube 音量</label>
      <input type="range" id="youtube-volume" min="0" max="100" step="1" value="50">
    </div>
  `;

  const todoForm = document.getElementById("todo-form");
  if (todoElement && todoForm) {
    todoElement.insertBefore(alarmUIWrapper, todoForm);
  }

  // ✅ 音量スライダーの連動処理（アラーム）
  const alarmVolumeSlider = document.getElementById("alarm-volume");
  const savedAlarmVol = localStorage.getItem("alarmVolume") || "0.5";
  alarmVolumeSlider.value = savedAlarmVol;

  const audioStart = new Audio();
  const audioEnd = new Audio();
  audioStart.volume = parseFloat(savedAlarmVol);
  audioEnd.volume = parseFloat(savedAlarmVol);

  alarmVolumeSlider.addEventListener("input", () => {
    const vol = parseFloat(alarmVolumeSlider.value);
    audioStart.volume = vol;
    audioEnd.volume = vol;
    localStorage.setItem("alarmVolume", vol);
  });

  const alarmStartSelect = document.getElementById("alarm-start-select");
  const alarmEndSelect = document.getElementById("alarm-end-select");
  const testStartBtn = document.getElementById("test-start");
  const testEndBtn = document.getElementById("test-end");
  const stopStartBtn = document.getElementById("stop-start");
  const stopEndBtn = document.getElementById("stop-end");

  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");

  const fileMap = {
    voice1: "voice1.mp3",
    voice2: "voice2.mp3",
    voice3: "voice3.mp3",
    voice4: "voice4.mp3",
    voice5: "voice5.mp3",
    voice6: "voice6.mp3",
    voice7: "voice7.mp3",
    voice8: "voice8.mp3",
    clapboard: "clapboard.mp3",
    dora: "dora.mp3",
    clock: "clock.mp3",
    "historical-drama": "historical-drama.mp3",
    ramen: "ramen.mp3",
    alarm2: "alarm2.mp3",
    alarm5: "alarm5.mp3",
    alarm12: "alarm12.mp3",
    voice9: "alarm15.mp3",
    voice10: "voice10.mp3",
    voice11: "voice11.mp3",
    voice12: "voice12.mp3",
    voice13: "voice13.mp3",
    voice14: "voice14.mp3",
    voice15: "voice15.mp3",
    voice16: "voice16.mp3",
    voice17: "voice17.mp3",
    voice18: "voice18.mp3",
    voice19: "voice19.mp3",
    voice20: "voice20.mp3",
  };

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

  function playAlarm(type) {
    const selected = type === "start" ? alarmStartSelect.value : alarmEndSelect.value;
    const file = fileMap[selected];
    if (!file) return;

    const audio = type === "start" ? audioStart : audioEnd;
    audio.src = `./alarm/${file}`;
    audio.play();
  }

  function updateTimer(nowOverride = null) {
    const now = nowOverride || new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const isLunchBreak = hours === 12;
    const isWorkTime = !isLunchBreak && minutes < 50;

    const remaining = isWorkTime ? (49 - minutes) * 60 + (59 - seconds) : (59 - minutes) * 60 + (59 - seconds);
    const displayMinutes = String(Math.floor(remaining / 60)).padStart(2, "0");
    const displaySeconds = String(remaining % 60).padStart(2, "0");
    timerElement.textContent = `${displayMinutes}:${displaySeconds}`;

    let targetVideoId = isWorkTime ? workVideoId : breakVideoId;
    if (isLunchBreak) targetVideoId = lunchVideoId;

    const currentVideoId = player?.getVideoData?.().video_id;
    if (player && currentVideoId !== targetVideoId) {
      player.setVolume(0);
      player.cueVideoById({ videoId: targetVideoId, suggestedQuality: "large" });
      setTimeout(() => {
        const nowAgain = new Date();
        const isStillLunch = nowAgain.getHours() === 12;
        const isStillWorkTime = !isStillLunch && nowAgain.getMinutes() < 50;
        const savedVolume = localStorage.getItem(
          isStillLunch ? "youtubeVolume_break" : isStillWorkTime ? "youtubeVolume_work" : "youtubeVolume_break"
        ) || (isStillWorkTime ? 1 : 1);
        player.setVolume(parseInt(savedVolume, 10));
        player.playVideo();

        const youtubeVolumeSlider = document.getElementById("youtube-volume");
        if (youtubeVolumeSlider) youtubeVolumeSlider.value = savedVolume;
      }, 300);
      playAlarm(isWorkTime ? "start" : "end");
    }

    if (isWorkTime) {
      timerElement.classList.remove("timer--top-left");
      if (todoElement) todoElement.style.display = "";
      if (breakWrapper) breakWrapper.classList.remove("visible");
    } else {
      timerElement.classList.add("timer--top-left");
      if (todoElement) todoElement.style.display = "none";
      if (breakWrapper) breakWrapper.classList.add("visible");

      let restartHour = hours;
      if (isLunchBreak) restartHour = 13;
      else if (minutes >= 50) restartHour = hours + 1;

      restartTimeText.textContent = `${String(restartHour).padStart(2, "0")}:00に再開します`;
    }
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

  setInterval(() => {
    if (typeof player !== "undefined" && typeof player.getVideoData === "function") {
      updateTimer();
    }
  }, 1000);
});

// ✅ デバッグ用：任意の時刻に切り替え（永続）
window.toggleBreak = (hour = 13, minute = 55) => {
  const fakeNow = new Date();
  fakeNow.setHours(hour);
  fakeNow.setMinutes(minute);

  class FakeDate extends Date {
    constructor(...args) { super(...args); }
    getMinutes() { return fakeNow.getMinutes(); }
    getHours() { return fakeNow.getHours(); }
  }
  window.Date = FakeDate;
  console.log(`✅ ${hour}:${minute} に時刻を偽装しました（リロードで解除）`);
};