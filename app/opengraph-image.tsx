import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Preview card shown when an invite link is shared on WhatsApp / Instagram.

export const alt = `${site.name}: dating where women make the call`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          color: "white",
          background: "linear-gradient(135deg, #3f1a70 0%, #7a34dc 55%, #f43f5e 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 44, fontWeight: 700, opacity: 0.9 }}>{site.name}</div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 92, fontWeight: 700, lineHeight: 1.05 }}>
          Dating where you make the call.
        </div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 36, opacity: 0.9 }}>
          {`Free for women · Verified men only · ${site.city}`}
        </div>
      </div>
    ),
    size,
  );
}
