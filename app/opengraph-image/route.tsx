import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
export const dynamic = "force-static";
export const runtime = "nodejs";
export async function GET() {
  const hero = await readFile(
    path.join(process.cwd(), "public/media/hero-social.jpg"),
  );
  const photo = `data:image/jpeg;base64,${hero.toString("base64")}`;
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "60px",
        background: "#0b0b0d",
        color: "#f4efe6",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Satori requires a plain image for the generated social card. */}
      <img
        src={photo}
        alt=""
        width={1200}
        height={630}
        style={{ position: "absolute", inset: 0, objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg,rgba(11,11,13,.9),rgba(11,11,13,.25))",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          position: "relative",
        }}
      >
        <span>MASSAFRA MX PARK</span>
        <span>GINOSA (TA), PUGLIA</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 100,
          fontWeight: 900,
          lineHeight: 1,
          position: "relative",
        }}
      >
        <span>DIVENTA</span>
        <span style={{ color: "#ff5a1f" }}>PROTAGONISTA.</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 23,
          borderTop: "3px solid #ff5a1f",
          paddingTop: 24,
          position: "relative",
        }}
      >
        MOTOCROSS / ENDURO / MINICROSS
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
