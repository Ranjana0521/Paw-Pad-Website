import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const START_PORT = parseInt(process.env.PORT || "3000", 10);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".webmanifest": "application/manifest+json",
  ".pdf": "application/pdf"
};

function handleRequest(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const urlPath = decodeURIComponent(parsedUrl.pathname);

  // API endpoint to list existing course forms and details pages
  if (urlPath === "/api/list-forms" && req.method === "GET") {
    try {
      const formsDir = path.join(ROOT, "course_forms");
      const files = fs.existsSync(formsDir) ? fs.readdirSync(formsDir).filter(f => f.endsWith(".html") || f.endsWith(".pdf")) : [];
      res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
      res.end(JSON.stringify({ success: true, files }));
      return;
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
      res.end(JSON.stringify({ success: false, error: err.message }));
      return;
    }
  }

  // API endpoint to upload a new HTML / PDF form or syllabus file
  if (urlPath === "/api/upload-form" && (req.method === "POST" || req.method === "OPTIONS")) {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      });
      res.end();
      return;
    }

    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        let rawName = path.basename(data.filename || "custom-form.html").replace(/[^a-zA-Z0-9_.-]/g, "-").toLowerCase();
        if (!rawName.endsWith(".html") && !rawName.endsWith(".pdf") && !rawName.endsWith(".htm")) {
          rawName += ".html";
        }
        const formsDir = path.join(ROOT, "course_forms");
        if (!fs.existsSync(formsDir)) {
          fs.mkdirSync(formsDir, { recursive: true });
        }
        const targetPath = path.join(formsDir, rawName);
        if (data.isBase64) {
          fs.writeFileSync(targetPath, Buffer.from(data.content, "base64"));
        } else {
          fs.writeFileSync(targetPath, data.content, "utf8");
        }

        res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
        res.end(JSON.stringify({
          success: true,
          filename: rawName,
          path: `course_forms/${rawName}`
        }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API endpoint to upload and save WebP images
  if (urlPath === "/api/upload-image" && (req.method === "POST" || req.method === "OPTIONS")) {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      });
      res.end();
      return;
    }

    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        let rawName = path.basename(data.filename || "image.webp").replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_.-]/g, "-").toLowerCase();
        if (!rawName.endsWith(".webp")) {
          rawName += ".webp";
        }
        const imgDir = path.join(ROOT, "assets", "img", "pawpad");
        if (!fs.existsSync(imgDir)) {
          fs.mkdirSync(imgDir, { recursive: true });
        }
        const targetPath = path.join(imgDir, rawName);
        const base64Data = (data.content || "").replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(targetPath, Buffer.from(base64Data, "base64"));

        res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
        res.end(JSON.stringify({
          success: true,
          filename: rawName,
          path: `assets/img/pawpad/${rawName}`
        }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  let filePath = path.join(ROOT, urlPath === "/" ? "index.html" : urlPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  } else if (!fs.existsSync(filePath) && fs.existsSync(`${filePath}.html`)) {
    filePath = `${filePath}.html`;
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";

  res.writeHead(200, {
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*"
  });
  fs.createReadStream(filePath).pipe(res);
}

function listenOnPort(port) {
  const server = http.createServer(handleRequest);
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE" || err.code === "ENOBUFS") {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      listenOnPort(port + 1);
    } else {
      console.error(err);
    }
  });
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}

listenOnPort(START_PORT);
