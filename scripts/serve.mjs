import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const START_PORT = parseInt(process.env.PORT || "3000", 10);
const MAX_BODY_SIZE = 25 * 1024 * 1024; // 25MB max payload to prevent DoS memory exhaustion

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
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".pdf": "application/pdf"
};

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

const SENSITIVE_PATTERNS = [
  /(^|[/\\])\.[^/\\]/i,           // Hidden files (.git, .env, .DS_Store, etc.)
  /(^|[/\\])node_modules([/\\]|$)/i, // node_modules
  /(^|[/\\])package(-lock)?\.json$/i, // package.json, package-lock.json
  /(^|[/\\])admin-config\.json$/i, // Server admin credentials config
  /(^|[/\\])scripts([/\\]|$)/i,   // Backend / build scripts
  /(^|[/\\])tests?([/\\]|$)/i,    // Test suites
  /(^|[/\\])playwright\.config/i, // Test runner configs
  /(^|[/\\])TODO\.md$/i
];

function readBody(req, res, maxBytes = MAX_BODY_SIZE) {
  return new Promise((resolve, reject) => {
    let body = "";
    let received = 0;

    req.on("data", (chunk) => {
      received += chunk.length;
      if (received > maxBytes) {
        req.destroy();
        res.writeHead(413, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          ...SECURITY_HEADERS
        });
        res.end(JSON.stringify({ success: false, error: "Payload Too Large. Limit is 25MB." }));
        reject(new Error("PAYLOAD_TOO_LARGE"));
        return;
      }
      body += chunk;
    });

    req.on("end", () => resolve(body));
    req.on("error", (err) => {
      if (!res.headersSent) {
        res.writeHead(400, { "Content-Type": "application/json", ...SECURITY_HEADERS });
        res.end(JSON.stringify({ success: false, error: "Bad Request Stream" }));
      }
      reject(err);
    });
  });
}

async function handleRequest(req, res) {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const rawPathname = decodeURIComponent(parsedUrl.pathname);

    // API endpoint: get / update server-side admin configuration (password, whitelist)
    if (rawPathname === "/api/admin-config") {
      if (req.method === "OPTIONS") {
        res.writeHead(204, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          ...SECURITY_HEADERS
        });
        res.end();
        return;
      }

      const configFile = path.join(ROOT, "admin-config.json");

      if (req.method === "GET") {
        try {
          let currentConfig = {
            primaryOwner: "pawpadpetstylist@gmail.com",
            defaultPassword: "2017",
            users: {
              "pawpadpetstylist@gmail.com": { role: "owner" }
            }
          };

          if (fs.existsSync(configFile)) {
            try {
              const raw = fs.readFileSync(configFile, "utf8");
              const loaded = JSON.parse(raw);
              if (loaded && typeof loaded === "object") {
                currentConfig = {
                  ...currentConfig,
                  ...loaded,
                  users: { ...currentConfig.users, ...(loaded.users || {}) }
                };
              }
            } catch { }
          }

          res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
            ...SECURITY_HEADERS
          });
          res.end(JSON.stringify({ success: true, config: currentConfig }));
          return;
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS });
          res.end(JSON.stringify({ success: false, error: "Failed to read server configuration" }));
          return;
        }
      }

      if (req.method === "POST") {
        let body;
        try {
          body = await readBody(req, res);
        } catch {
          return;
        }

        try {
          const updates = JSON.parse(body || "{}");
          let currentConfig = {
            primaryOwner: "pawpadpetstylist@gmail.com",
            defaultPassword: "2017",
            users: {
              "pawpadpetstylist@gmail.com": { role: "owner" }
            }
          };

          if (fs.existsSync(configFile)) {
            try {
              const loaded = JSON.parse(fs.readFileSync(configFile, "utf8")) || {};
              currentConfig = {
                ...currentConfig,
                ...loaded,
                users: { ...currentConfig.users, ...(loaded.users || {}) }
              };
            } catch { }
          }

          if (updates.primaryOwner && typeof updates.primaryOwner === "string") {
            currentConfig.primaryOwner = updates.primaryOwner.trim().toLowerCase();
          }

          if (updates.defaultPassword && typeof updates.defaultPassword === "string") {
            currentConfig.defaultPassword = updates.defaultPassword.trim();
          }

          // Full users object replacement/merge
          if (updates.users && typeof updates.users === "object" && !Array.isArray(updates.users)) {
            currentConfig.users = { ...currentConfig.users, ...updates.users };
          }

          // Update individual user's password
          if (updates.userPassword && updates.userPassword.email && updates.userPassword.password) {
            const email = updates.userPassword.email.trim().toLowerCase();
            const pass = updates.userPassword.password.trim();
            if (!currentConfig.users[email]) {
              currentConfig.users[email] = { role: "admin" };
            }
            currentConfig.users[email].password = pass;
            currentConfig.users[email].updatedAt = new Date().toISOString();
          }

          // Add a new user (starts with default password)
          if (updates.addUser && updates.addUser.email) {
            const email = updates.addUser.email.trim().toLowerCase();
            if (!currentConfig.users[email]) {
              currentConfig.users[email] = {
                role: updates.addUser.role || "admin",
                createdAt: new Date().toISOString()
              };
            }
          }

          // Remove a user
          if (updates.removeUser && typeof updates.removeUser === "string") {
            const email = updates.removeUser.trim().toLowerCase();
            if (email !== currentConfig.primaryOwner.toLowerCase()) {
              delete currentConfig.users[email];
            }
          }

          currentConfig.updatedAt = new Date().toISOString();
          fs.writeFileSync(configFile, JSON.stringify(currentConfig, null, 2), "utf8");

          res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
            ...SECURITY_HEADERS
          });
          res.end(JSON.stringify({ success: true, message: "Configuration saved successfully", config: currentConfig }));
          return;
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS });
          res.end(JSON.stringify({ success: false, error: err.message || "Failed to update configuration" }));
          return;
        }
      }

      res.writeHead(405, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS });
      res.end(JSON.stringify({ success: false, error: "Method Not Allowed" }));
      return;
    }

    // API endpoint: list existing course forms and details pages
    if (rawPathname === "/api/list-forms") {
      if (req.method === "OPTIONS") {
        res.writeHead(204, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          ...SECURITY_HEADERS
        });
        res.end();
        return;
      }
      if (req.method !== "GET") {
        res.writeHead(405, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS });
        res.end(JSON.stringify({ success: false, error: "Method Not Allowed" }));
        return;
      }
      try {
        const formsDir = path.join(ROOT, "course_forms");
        const files = fs.existsSync(formsDir)
          ? fs.readdirSync(formsDir).filter((f) => f.endsWith(".html") || f.endsWith(".pdf"))
          : [];
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
          ...SECURITY_HEADERS
        });
        res.end(JSON.stringify({ success: true, files }));
        return;
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS });
        res.end(JSON.stringify({ success: false, error: "Internal Server Error" }));
        return;
      }
    }

    // API endpoint: upload a new HTML / PDF form or syllabus file
    if (rawPathname === "/api/upload-form") {
      if (req.method === "OPTIONS") {
        res.writeHead(204, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          ...SECURITY_HEADERS
        });
        res.end();
        return;
      }
      if (req.method !== "POST") {
        res.writeHead(405, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS });
        res.end(JSON.stringify({ success: false, error: "Method Not Allowed" }));
        return;
      }

      let body;
      try {
        body = await readBody(req, res);
      } catch {
        return;
      }

      try {
        const data = JSON.parse(body);
        if (!data || typeof data.content !== "string") {
          res.writeHead(400, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS });
          res.end(JSON.stringify({ success: false, error: "Missing or invalid file content" }));
          return;
        }

        let rawName = path.basename(data.filename || "custom-form.html").replace(/[^a-zA-Z0-9_.-]/g, "-").toLowerCase();
        if (!rawName.endsWith(".html") && !rawName.endsWith(".pdf") && !rawName.endsWith(".htm")) {
          rawName += ".html";
        }

        const formsDir = path.join(ROOT, "course_forms");
        if (!fs.existsSync(formsDir)) {
          fs.mkdirSync(formsDir, { recursive: true });
        }
        const targetPath = path.resolve(formsDir, rawName);
        if (!targetPath.startsWith(formsDir)) {
          res.writeHead(403, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS });
          res.end(JSON.stringify({ success: false, error: "Invalid file target path" }));
          return;
        }

        if (data.isBase64) {
          fs.writeFileSync(targetPath, Buffer.from(data.content, "base64"));
        } else {
          fs.writeFileSync(targetPath, data.content, "utf8");
        }

        res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS });
        res.end(JSON.stringify({
          success: true,
          filename: rawName,
          path: `course_forms/${rawName}`
        }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS });
        res.end(JSON.stringify({ success: false, error: err.message || "Failed to save form" }));
      }
      return;
    }

    // API endpoint: upload and save WebP images
    if (rawPathname === "/api/upload-image") {
      if (req.method === "OPTIONS") {
        res.writeHead(204, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          ...SECURITY_HEADERS
        });
        res.end();
        return;
      }
      if (req.method !== "POST") {
        res.writeHead(405, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS });
        res.end(JSON.stringify({ success: false, error: "Method Not Allowed" }));
        return;
      }

      let body;
      try {
        body = await readBody(req, res);
      } catch {
        return;
      }

      try {
        const data = JSON.parse(body);
        if (!data || typeof data.content !== "string") {
          res.writeHead(400, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS });
          res.end(JSON.stringify({ success: false, error: "Missing or invalid image content" }));
          return;
        }

        let rawName = path.basename(data.filename || "image.webp").replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_.-]/g, "-").toLowerCase();
        if (!rawName.endsWith(".webp")) {
          rawName += ".webp";
        }
        const imgDir = path.join(ROOT, "assets", "img", "pawpad");
        if (!fs.existsSync(imgDir)) {
          fs.mkdirSync(imgDir, { recursive: true });
        }
        const targetPath = path.resolve(imgDir, rawName);
        if (!targetPath.startsWith(imgDir)) {
          res.writeHead(403, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS });
          res.end(JSON.stringify({ success: false, error: "Invalid image target path" }));
          return;
        }

        const base64Data = (data.content || "").replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(targetPath, Buffer.from(base64Data, "base64"));

        res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS });
        res.end(JSON.stringify({
          success: true,
          filename: rawName,
          path: `assets/img/pawpad/${rawName}`
        }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS });
        res.end(JSON.stringify({ success: false, error: err.message || "Failed to save image" }));
      }
      return;
    }

    // Handle Static Files with Path Traversal Protection
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8", ...SECURITY_HEADERS });
      res.end("405 Method Not Allowed");
      return;
    }

    // Normalize path and eliminate any traversal sequences
    const safePath = path.normalize(rawPathname).replace(/^(\.\.[/\\])+/, "");
    let resolvedPath = path.resolve(ROOT, "." + safePath);

    // Strict boundary enforcement: resolved path must strictly start with ROOT
    if (!resolvedPath.startsWith(ROOT)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8", ...SECURITY_HEADERS });
      res.end("403 Forbidden");
      return;
    }

    // Block sensitive files and directories
    const relFromRoot = path.relative(ROOT, resolvedPath);
    const isSensitive = SENSITIVE_PATTERNS.some((pattern) => pattern.test(safePath) || pattern.test(relFromRoot));
    if (isSensitive) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8", ...SECURITY_HEADERS });
      res.end("403 Forbidden");
      return;
    }

    if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
      resolvedPath = path.join(resolvedPath, "index.html");
    } else if (!fs.existsSync(resolvedPath) && fs.existsSync(`${resolvedPath}.html`)) {
      resolvedPath = `${resolvedPath}.html`;
    }

    if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8", ...SECURITY_HEADERS });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";
    const isHtml = ext === ".html";
    const cacheControl = isHtml ? "no-cache" : "public, max-age=3600, stale-while-revalidate=86400";

    const stat = fs.statSync(resolvedPath);
    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stat.size,
      "Cache-Control": cacheControl,
      "Access-Control-Allow-Origin": "*",
      ...SECURITY_HEADERS
    });

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    fs.createReadStream(resolvedPath).pipe(res);
  } catch (err) {
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8", ...SECURITY_HEADERS });
      res.end("500 Internal Server Error");
    }
  }
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
