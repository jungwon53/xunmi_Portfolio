async function loadArtworkData() {
  let response = await fetch("/api/artworks");
  if (!response.ok) response = await fetch("artworks.json");
  const data = await response.json();
  return data.works || [];
}

function workMeta(work) {
  return [work.year, work.medium].filter(Boolean).join(" / ");
}

function createFigure(work, className) {
  const figure = document.createElement("figure");
  figure.className = className;

  const image = document.createElement("img");
  image.src = work.src;
  image.alt = work.title;
  image.loading = "lazy";

  const caption = document.createElement("figcaption");
  caption.innerHTML = `<strong>${work.title}</strong><span>${workMeta(work)}</span>`;

  figure.append(image, caption);
  return figure;
}

async function renderSalon() {
  const works = await loadArtworkData();
  const featureGrid = document.querySelector("#feature-grid");
  const wallGrid = document.querySelector("#wall-grid");

  works.slice(0, 4).forEach((work) => {
    featureGrid.append(createFigure(work, "feature-card"));
  });

  works.forEach((work) => {
    wallGrid.append(createFigure(work, "wall-item"));
  });
}

renderSalon().catch(() => {
  document.querySelector("#wall-grid").innerHTML = "<p>작품을 불러오지 못했습니다.</p>";
});
