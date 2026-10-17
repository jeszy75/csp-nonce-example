import http from "node:http";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";

const htmlPath = path.join(import.meta.dirname, "public", "index.html");

const server = http.createServer(async (req, res) => {
    try {
        if (req.method !== "GET" || req.url !== "/") {
            res.writeHead(404).end("Not found");
            return;
        }

        const nonce = randomBytes(16).toString("base64");
        const html = await readFile(htmlPath, "utf8");
        const body = html.replaceAll("__CSP_NONCE__", nonce);

        res.setHeader(
            "Content-Security-Policy",
            `default-src 'self'; script-src 'self' 'nonce-${nonce}'`
        );
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        res.end(body);
    } catch (err) {
        console.error(err);
        res.writeHead(500).end("Internal Server Error");
    }
});

server.listen(8080);
