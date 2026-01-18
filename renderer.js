//renderer.js
const { ipcRenderer } = require('electron');
const panel = document.getElementById("widget");
const wrapper = document.getElementById("wrapper");
const toggleBtn = document.getElementById("toggleBtn");
const collapsedIcon = document.getElementById("collapsedIcon");

let pinned = false; // 고정상태

//임시 확인용 : 노란색 버튼 누르면 -> 강의 교안
const btnYellow = document.querySelector('.yellow');
btnYellow.addEventListener('click', () => {
  ipcRenderer.send('trigger-chrome', 'https://baceru.vercel.app');
});

// + 버튼 클릭
toggleBtn.addEventListener("click", () => {
  ipcRenderer.send('open-popup');
});

/**
 * 아이콘 클릭 규칙
 * - pinned === false && hover 중 → 고정
 * - pinned === true → 닫힘
 */
collapsedIcon.addEventListener("click", () => {
  pinned = !pinned;

  wrapper.classList.toggle("pinned", pinned);
});
