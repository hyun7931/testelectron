const panel = document.getElementById("widget");
const wrapper = document.getElementById("wrapper");
const toggleBtn = document.getElementById("toggleBtn");
const collapsedIcon = document.getElementById("collapsedIcon");

let pinned = false; // 고정상태

// + 버튼 클릭
toggleBtn.addEventListener("click", () => {});

/**
 * 아이콘 클릭 규칙
 * - pinned === false && hover 중 → 고정
 * - pinned === true → 닫힘
 */
collapsedIcon.addEventListener("click", () => {
  pinned = !pinned;

  wrapper.classList.toggle("pinned", pinned);
});
