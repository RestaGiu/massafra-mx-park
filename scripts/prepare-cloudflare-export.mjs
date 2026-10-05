import { writeFile } from "node:fs/promises";

const destination = "/massaframxpark/it/";
const html = `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="refresh" content="0;url=${destination}">
    <link rel="canonical" href="https://restagiu.com${destination}">
    <title>Massafra MX Park</title>
  </head>
  <body style="margin:0;background:#0b0b0d;color:#f4efe6;font:600 18px system-ui;display:grid;min-height:100vh;place-items:center">
    <a style="color:#ff5a1f" href="${destination}">Apri Massafra MX Park</a>
    <script>location.replace(${JSON.stringify(destination)});</script>
  </body>
</html>`;

await writeFile(new URL("../out/index.html", import.meta.url), html);
