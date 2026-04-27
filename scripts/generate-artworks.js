const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const artDir = path.join(root, "artImg");
const outputPath = path.join(root, "artworks.json");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function readMetadata() {
  const metadataPath = path.join(root, "works.json");
  if (!fs.existsSync(metadataPath)) return {};

  try {
    const data = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
    return Object.fromEntries((data.works || []).map((work) => [work.file, work]));
  } catch (error) {
    console.warn("Could not read works.json:", error.message);
    return {};
  }
}

function sortArtworkFiles(a, b) {
  const aName = path.parse(a).name;
  const bName = path.parse(b).name;
  const aVariant = Number(aName.match(/_(\d+)$/)?.[1] || 0);
  const bVariant = Number(bName.match(/_(\d+)$/)?.[1] || 0);
  const aBase = aName.replace(/_\d+$/, "");
  const bBase = bName.replace(/_\d+$/, "");
  return aBase.localeCompare(bBase, "ko") || aVariant - bVariant;
}

function listArtworks() {
  const metadata = readMetadata();
  const files = fs.existsSync(artDir)
    ? fs.readdirSync(artDir)
        .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
        .sort(sortArtworkFiles)
    : [];

  return files.map((file, index) => {
    const meta = metadata[file] || {};
    return {
      id: path.parse(file).name,
      file,
      src: `artImg/${encodeURIComponent(file)}`,
      title: meta.title || `Work ${String(index + 1).padStart(2, "0")}`,
      year: meta.year || "",
      medium: meta.medium || "",
      note: meta.note || "아직 이름 붙기 전의 장면. 작품이 가진 정적과 온도를 먼저 바라봅니다.",
      featured: Boolean(meta.featured)
    };
  });
}

fs.writeFileSync(outputPath, `${JSON.stringify({ works: listArtworks() }, null, 2)}\n`, "utf8");
console.log(`Generated ${path.relative(root, outputPath)}`);
