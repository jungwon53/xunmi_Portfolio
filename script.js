const gallery = document.querySelector("#gallery");
const heroImage = document.querySelector("#hero-image");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxMeta = document.querySelector("#lightbox-meta");
const lightboxNote = document.querySelector("#lightbox-note");
const closeButton = document.querySelector(".lightbox-close");

let works = [];

function metaText(work) {
  return [work.year, work.medium].filter(Boolean).join(" · ");
}

function openLightbox(work) {
  lightboxImage.src = work.src;
  lightboxImage.alt = work.title;
  lightboxTitle.textContent = work.title;
  lightboxMeta.textContent = metaText(work);
  lightboxNote.textContent = work.note;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function renderGallery() {
  gallery.innerHTML = "";

  works.forEach((work) => {
    const article = document.createElement("article");
    article.className = "work-card";

    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `${work.title} 크게 보기`);
    button.addEventListener("click", () => openLightbox(work));

    const image = document.createElement("img");
    image.src = work.src;
    image.alt = work.title;
    image.loading = "lazy";

    const caption = document.createElement("div");
    caption.className = "work-caption";
    caption.innerHTML = `
      <strong>${work.title}</strong>
      <span>${metaText(work)}</span>
      <p>${work.note}</p>
    `;

    button.append(image, caption);
    article.append(button);
    gallery.append(article);
  });
}

async function loadWorks() {
  const response = await fetch("/api/artworks");
  const data = await response.json();
  works = data.works || [];

  const heroWork = works.find((work) => work.featured) || works[0];
  if (heroWork) {
    heroImage.src = heroWork.src;
    heroImage.alt = heroWork.title;
  }

  renderGallery();
}

closeButton.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

loadWorks().catch(() => {
  gallery.innerHTML = "<p>작품 이미지를 불러오지 못했습니다.</p>";
});
