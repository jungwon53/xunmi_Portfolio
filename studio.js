const stage = document.querySelector("#stage");
const activeWork = document.querySelector("#active-work");
const activeImage = document.querySelector("#active-image");
const activeTitle = document.querySelector("#active-title");
const activeMeta = document.querySelector("#active-meta");
const activeNote = document.querySelector("#active-note");
const counter = document.querySelector("#counter");
const thumbs = document.querySelector("#thumbs");
const prevButton = document.querySelector("#prev-work");
const nextButton = document.querySelector("#next-work");

let works = [];
let activeIndex = 0;

async function loadArtworkData() {
  let response = await fetch("/api/artworks");
  if (!response.ok) response = await fetch("artworks.json");
  const data = await response.json();
  return data.works || [];
}

function metaText(work) {
  return [work.year, work.medium].filter(Boolean).join(" / ");
}

function selectWork(index) {
  if (!works.length) return;

  activeIndex = (index + works.length) % works.length;
  const work = works[activeIndex];

  activeImage.src = work.src;
  activeImage.alt = work.title;
  activeTitle.textContent = work.title;
  activeMeta.textContent = metaText(work);
  activeNote.textContent = work.note;
  counter.textContent = String(activeIndex + 1).padStart(2, "0");

  thumbs.querySelectorAll("button").forEach((button, buttonIndex) => {
    button.setAttribute("aria-selected", String(buttonIndex === activeIndex));
  });
}

function renderThumbs() {
  thumbs.innerHTML = "";

  works.forEach((work, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `${work.title} 선택`);
    button.setAttribute("aria-selected", "false");
    button.addEventListener("click", () => selectWork(index));

    const image = document.createElement("img");
    image.src = work.src;
    image.alt = "";
    image.loading = "lazy";

    button.append(image);
    thumbs.append(button);
  });
}

function handlePointerMove(event) {
  const rect = stage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const tiltX = (x - 0.5) * 10;
  const tiltY = (0.5 - y) * 8;

  document.documentElement.style.setProperty("--spot-x", `${x * 100}%`);
  document.documentElement.style.setProperty("--spot-y", `${y * 100}%`);
  document.documentElement.style.setProperty("--tilt-x", `${tiltX}deg`);
  document.documentElement.style.setProperty("--tilt-y", `${tiltY}deg`);
}

function handleKeydown(event) {
  if (event.key === "ArrowRight") selectWork(activeIndex + 1);
  if (event.key === "ArrowLeft") selectWork(activeIndex - 1);
}

async function initStudio() {
  works = await loadArtworkData();
  renderThumbs();
  selectWork(0);
}

prevButton.addEventListener("click", () => selectWork(activeIndex - 1));
nextButton.addEventListener("click", () => selectWork(activeIndex + 1));
stage.addEventListener("pointermove", handlePointerMove);
window.addEventListener("keydown", handleKeydown);

initStudio().catch(() => {
  activeTitle.textContent = "작품을 불러오지 못했습니다.";
});
