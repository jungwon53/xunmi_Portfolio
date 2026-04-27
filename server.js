const fs = require("fs");
const path = require("path");
const http = require("http");

const root = __dirname;
const artDir = path.join(root, "artImg");
const port = Number(process.env.PORT || 4173);
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif"
};

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

function listArtworks() {
  const metadata = readMetadata();
  const files = fs.existsSync(artDir)
    ? fs.readdirSync(artDir)
        .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
        .sort((a, b) => {
          const aName = path.parse(a).name;
          const bName = path.parse(b).name;
          const aVariant = Number(aName.match(/_(\d+)$/)?.[1] || 0);
          const bVariant = Number(bName.match(/_(\d+)$/)?.[1] || 0);
          const aBase = aName.replace(/_\d+$/, "");
          const bBase = bName.replace(/_\d+$/, "");
          return aBase.localeCompare(bBase, "ko") || aVariant - bVariant;
        })
    : [];

  return files.map((file, index) => {
    const meta = metadata[file] || {};
    return {
      id: path.parse(file).name,
      file,
      src: `/artImg/${encodeURIComponent(file)}`,
      title: meta.title || `Work ${String(index + 1).padStart(2, "0")}`,
      year: meta.year || "",
      medium: meta.medium || "",
      note: meta.note || "아직 이름 붙기 전의 장면. 작품이 가진 정적과 온도를 먼저 바라봅니다.",
      featured: Boolean(meta.featured)
    };
  });
}

function send(res, status, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function serveFile(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requestedPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.normalize(path.join(root, requestedPath));

  if (!filePath.startsWith(root)) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, "Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream"
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/artworks")) {
    send(res, 200, JSON.stringify({ works: listArtworks() }), "application/json; charset=utf-8");
    return;
  }

  serveFile(req, res);
});

server.listen(port, () => {
  console.log(`Portfolio site running at http://localhost:${port}`);
});
