document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.querySelector('meta[name="viewport"]');

  if (window.innerWidth <= 375 && viewport) {
    viewport.setAttribute("content", "width=375");
  }
});

// ✅ YouTube IFrame APIでプレイヤーを制御（無音再生 → 3秒後に音量復元）
let player;

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("youtube-frame", {
    videoId: "-Zk7Y-8mf6Q",
    playerVars: {
      autoplay: 1,
      mute: 1, // 最初は必ず無音
      loop: 1,
      playlist: "-Zk7Y-8mf6Q",
    },
    events: {
      onReady: () => {
        player.playVideo(); // 無音で再生開始

        const youtubeVolumeSlider = document.getElementById("youtube-volume");

        if (youtubeVolumeSlider) {
          // ✅ 最初スライダーに savedVolume をセット
          const isWorkTime = new Date().getMinutes() % 60 < 50;
          const savedVolume = localStorage.getItem(isWorkTime ? "youtubeVolume_work" : "youtubeVolume_break") || 50;
          youtubeVolumeSlider.value = savedVolume;

          // ✅ スライダーを触った瞬間だけ unmute＋volume設定
          let isUnmuted = false;
          youtubeVolumeSlider.addEventListener("input", () => {
            const vol = parseInt(youtubeVolumeSlider.value, 10);
            player.setVolume(vol);

            if (!isUnmuted) {
              player.unMute();
              isUnmuted = true;
            }

            localStorage.setItem(new Date().getMinutes() % 60 < 50 ? "youtubeVolume_work" : "youtubeVolume_break", vol);
          });
        }

        setInterval(updateTimer, 1000);
      },
    },
  });
};

// ① 関数定義（DOMContentLoadedより前）
function setTimerMinWidth() {
  const timerElement = document.querySelector(".timer");
  if (!timerElement) return;

  const span = document.createElement("span");
  span.style.position = "absolute";
  span.style.visibility = "hidden";
  span.style.whiteSpace = "nowrap";
  span.style.fontFamily = getComputedStyle(timerElement).fontFamily;
  span.style.fontSize = getComputedStyle(timerElement).fontSize;
  span.innerText = "00:00";

  document.body.appendChild(span);
  const width = span.offsetWidth;
  timerElement.style.minWidth = `${width}px`;
  span.remove();
}

// ✅ アラーム音を再生する関数
function playAlarm(type) {
  const selectEl = type === "start" ? alarmStartSelect : alarmEndSelect;
  const selected = selectEl.value;

  const file = fileMap[selected];
  if (!file) return;

  const audio = type === "start" ? audioStart : audioEnd;
  audio.src = `./alarm/${file}`;
  audio.play();
}

// 🔽 アラームセレクト要素の取得
const alarmStartSelect = document.getElementById("alarm-start-select");
const alarmEndSelect = document.getElementById("alarm-end-select");

// 🔽 ローカルストレージから値を読み込んで反映
const savedStart = localStorage.getItem("alarmSound_start");
const savedEnd = localStorage.getItem("alarmSound_end");
if (savedStart) alarmStartSelect.value = savedStart;
if (savedEnd) alarmEndSelect.value = savedEnd;

// 🔽 ユーザーが選択を変えたら保存する
alarmStartSelect.addEventListener("change", () => {
  localStorage.setItem("alarmSound_start", alarmStartSelect.value);
});
alarmEndSelect.addEventListener("change", () => {
  localStorage.setItem("alarmSound_end", alarmEndSelect.value);
});

document.addEventListener("DOMContentLoaded", () => {
  const workVideoId = "-Zk7Y-8mf6Q";
  const breakVideoId = "-Zk7Y-8mf6Q";
  const lunchVideoId = "-Zk7Y-8mf6Q";

  const timerElement = document.querySelector(".timer");
  // ✅ タイマーの最小幅を設定（ズレ防止）
  setTimerMinWidth();
  const todoElement = document.querySelector(".todo");
  const breakWrapper = document.querySelector(".time-break__wrapper");
  const breakText = document.querySelector(".time-break");
  const restartTimeText = document.getElementById("restart-time");
  const todoForm = document.getElementById("todo-form");

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

  const alarmUIWrapper = document.querySelector(".alarm-ui");

  const alarmSlider = alarmUIWrapper.querySelector("#alarm-volume");
  const alarmUI = alarmUIWrapper;

  if (alarmSlider && alarmUI) {
    alarmSlider.addEventListener("mouseenter", () => {
      alarmUI.classList.add("is-hovered");
    });
    alarmSlider.addEventListener("mouseleave", () => {
      alarmUI.classList.remove("is-hovered");
    });
  }

  const youtubeSlider = alarmUIWrapper.querySelector("#youtube-volume");

  if (youtubeSlider && alarmUIWrapper) {
    youtubeSlider.addEventListener("mouseenter", () => {
      alarmUIWrapper.classList.add("is-hovered");
    });
    youtubeSlider.addEventListener("mouseleave", () => {
      alarmUIWrapper.classList.remove("is-hovered");
    });
  }

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
    const breakCountdownText = document.getElementById("break-countdown");
    const breakWrapper = document.querySelector(".time-break__wrapper");
    const fullscreenCountdown = document.getElementById("break-fullscreen-countdown");

    const remaining = isWorkTime ? (49 - minutes) * 60 + (59 - seconds) : (59 - minutes) * 60 + (59 - seconds);
    // 既存：remaining の計算後
    // ✅ これだけでOK（常に表示）
    timerElement.style.visibility = "visible";

    const displayMinutes = String(Math.floor(remaining / 60)).padStart(2, "0");
    const displaySeconds = String(remaining % 60).padStart(2, "0");
    if (remaining <= 59 && remaining > 0) {
      timerElement.textContent = remaining.toString(); // 数字のみ
      timerElement.classList.add("timer__clock--countdown");
    } else if (remaining === 0) {
      timerElement.textContent = "0";
      timerElement.classList.remove("timer__clock--countdown");
    } else {
      timerElement.textContent = `${displayMinutes}:${displaySeconds}`;
      timerElement.classList.remove("timer__clock--countdown");
    }

    let targetVideoId = isWorkTime ? workVideoId : breakVideoId;
    if (isLunchBreak) targetVideoId = lunchVideoId;

    const currentVideoId = player?.getVideoData?.().video_id;
    if (player && currentVideoId !== targetVideoId) {
      player.setVolume(0);
      player.cueVideoById({
        videoId: targetVideoId,
        suggestedQuality: "large",
      });
      setTimeout(() => {
        const nowAgain = new Date();
        const isStillLunch = nowAgain.getHours() === 12;
        const isStillWorkTime = !isStillLunch && nowAgain.getMinutes() < 50;
        const savedVolume = localStorage.getItem(isStillLunch ? "youtubeVolume_break" : isStillWorkTime ? "youtubeVolume_work" : "youtubeVolume_break") || (isStillWorkTime ? 1 : 1);
        player.setVolume(parseInt(savedVolume, 10));
        player.playVideo();

        const youtubeVolumeSlider = document.getElementById("youtube-volume");
        if (youtubeVolumeSlider) youtubeVolumeSlider.value = savedVolume;
      }, 300);
      playAlarm(isWorkTime ? "start" : "end");
    }

    if (isWorkTime) {
      // 作業中表示
      timerElement.classList.remove("timer--top-left");
      if (todoElement) {
        todoElement.style.display = "";
        todoElement.classList.remove("todo--floating"); // ★追加！
      }
      if (breakWrapper) breakWrapper.classList.remove("visible");

      breakCountdownText.textContent = "";
      fullscreenCountdown.classList.add("hidden");
    } else {
      // 休憩中
      // timerElement.classList.add("timer--top-left");
      // if (todoElement) {
      //   todoElement.style.display = "";
      //   todoElement.classList.add("todo--floating"); // ★追加！
      // }
      if (breakWrapper) breakWrapper.classList.add("visible");

      let restartHour = hours;
      if (isLunchBreak) restartHour = 13;
      else if (minutes >= 50) restartHour = hours + 1;

      restartTimeText.textContent = `${String(restartHour).padStart(2, "0")}:00に再開します`;

      if (remaining > 10 && remaining <= 59) {
        // 👇 通常のカウントダウン（下に表示）
        fullscreenCountdown.classList.add("hidden");
        breakCountdownText.textContent = `${remaining} 秒後に作業再開`;
        breakCountdownText.style.display = "";
        restartTimeText.style.display = "";
        breakText.style.display = "";
      } else if (remaining <= 10 && remaining > 0) {
        // 👇 でっかい中央表示
        breakCountdownText.style.display = "none";
        restartTimeText.style.display = "none";
        breakText.style.display = "none";

        fullscreenCountdown.textContent = remaining;
        fullscreenCountdown.classList.remove("hidden");
        fullscreenCountdown.classList.remove("break-fullscreen-countdown");
        void fullscreenCountdown.offsetWidth; // リフロー強制
        fullscreenCountdown.classList.add("break-fullscreen-countdown");
        fullscreenCountdown.style.color = "#ffffff";

        // ★ここから追記！
        const width = fullscreenCountdown.offsetWidth;
        fullscreenCountdown.style.left = "50%";
        fullscreenCountdown.style.transform = `translate(-${width / 2}px, -50%)`;

        // 👇 ここに追記！
        gsap.fromTo(
          fullscreenCountdown,
          { y: -5, scale: 3, transformOrigin: "center" },
          {
            y: 5,
            scale: 1,
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            ease: "power1.inOut",
          }
        );
      } else if (remaining === 0) {
        breakCountdownText.style.display = "none";
        restartTimeText.style.display = "none";
        breakText.style.display = "none";

        fullscreenCountdown.textContent = "0";
        fullscreenCountdown.classList.remove("hidden");
        fullscreenCountdown.classList.remove("break-fullscreen-countdown");
        void fullscreenCountdown.offsetWidth;
        fullscreenCountdown.classList.add("break-fullscreen-countdown");

        // ✅ 💥 ← 爆発後に必要なスタイルリセット！
        fullscreenCountdown.style.opacity = "1";
        fullscreenCountdown.style.filter = "none";
        fullscreenCountdown.style.color = "#ffffff";
        fullscreenCountdown.style.transform = `translate(-50%, -50%) scale(1)`;

        const width = fullscreenCountdown.offsetWidth;
        fullscreenCountdown.style.left = "50%";
        fullscreenCountdown.style.transform = `translate(-${width / 2}px, -50%)`;

        // ✅ 続けて爆発フェードアウト
        gsap.to(fullscreenCountdown, {
          delay: 0.2,
          scale: 9.2,
          opacity: 0,
          filter: "blur(8px)",
          duration: 3,
          ease: "expo.out",
        });

        // ✅ 💥★これが最後に必要！
        setTimeout(() => {
          gsap.killTweensOf(fullscreenCountdown); // ← これで全GSAPの影響を止める！

          fullscreenCountdown.textContent = "";
          fullscreenCountdown.classList.add("hidden");
          fullscreenCountdown.style.filter = "none";
          fullscreenCountdown.style.opacity = "1";
          fullscreenCountdown.style.transform = `translate(-50%, -50%) scale(1)`;
          fullscreenCountdown.style.color = "#ffffff"; // ← これで次に白で表示される！
        }, 3000);
      }
    }

    // 追加部分（既存の updateTimer 内）
    const remainingRatio = remaining / 60;

    timerElement.classList.remove("timer__clock--normal", "timer__clock--warn", "timer__clock--danger");

    if (remaining <= 59) {
      timerElement.classList.add("timer__clock--danger");
    } else if (remaining <= 5 * 60) {
      timerElement.classList.add("timer__clock--warn");
    } else {
      timerElement.classList.add("timer__clock--normal");
    }

    if (remaining <= 59 && remaining > 10) {
      timerElement.classList.add("timer__clock--near-end");
    } else {
      timerElement.classList.remove("timer__clock--near-end");
    }

    // カウント強調（10秒以内）
    if (remaining <= 9) {
      timerElement.classList.add("timer__clock--countdown");
    } else {
      timerElement.classList.remove("timer__clock--countdown");
    }

    if (remaining <= 9) {
      timerElement.classList.remove("timer__clock--countdown"); // 一度外す

      // 再発火のためにタイミングずらして add
      setTimeout(() => {
        timerElement.classList.add("timer__clock--countdown");
      }, 9);
    } else {
      timerElement.classList.remove("timer__clock--countdown");
    }

    const breakCountdown = document.getElementById("break-countdown");

    if (!isWorkTime) {
      if (remaining <= 59 && remaining > 0) {
        // 1分未満 → 下に表示
        breakCountdown.classList.remove("explode");
        breakCountdown.textContent = `${remaining} 秒後に作業再開`;
      } else if (remaining === 0) {
        // 残り0秒 → 中央にズーム演出
        breakCountdown.textContent = "0";
        breakCountdown.classList.add("explode");

        setTimeout(() => {
          breakCountdown.textContent = "";
          breakCountdown.classList.remove("explode");
        }, 800);
      } else {
        // 通常時
        breakCountdown.textContent = "";
        breakCountdown.classList.remove("explode");
      }
    } else {
      // 作業中は非表示
      breakCountdown.textContent = "";
      breakCountdown.classList.remove("explode");
    }
  }

  if (testStartBtn) testStartBtn.addEventListener("click", () => playAlarm("start"));
  if (testEndBtn) testEndBtn.addEventListener("click", () => playAlarm("end"));
  if (stopStartBtn)
    stopStartBtn.addEventListener("click", () => {
      audioStart.pause();
      audioStart.currentTime = 0;
    });
  if (stopEndBtn)
    stopEndBtn.addEventListener("click", () => {
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
    constructor(...args) {
      super(...args);
    }
    getMinutes() {
      return fakeNow.getMinutes();
    }
    getHours() {
      return fakeNow.getHours();
    }
  }
  window.Date = FakeDate;
  console.log(`✅ ${hour}:${minute} に時刻を偽装しました（リロードで解除）`);
  //   toggleBreak(12, 10);
  // // → 時刻を「12時10分」に偽装する
};
