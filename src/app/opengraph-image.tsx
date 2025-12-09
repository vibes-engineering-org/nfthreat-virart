import { ImageResponse } from "next/og";
import {
  PROJECT_TITLE,
  PROJECT_DESCRIPTION,
  PROJECT_AVATAR_URL,
} from "~/lib/constants";

export const alt = PROJECT_TITLE;
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#1a1a1a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Art gallery inspired gradient background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, #2D1B69 0%, #1A1A2E 50%, #16213E 100%)",
            opacity: 1,
          }}
        />

        {/* Gallery frame pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 30% 40%, rgba(138, 99, 210, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)",
          }}
        />

        {/* Subtle grid pattern for gallery feel */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Main content container - centered in safe zone */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "60px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Creator avatar in gallery frame */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "48px",
              position: "relative",
            }}
          >
            {/* Gallery spotlight effect */}
            <div
              style={{
                position: "absolute",
                width: "160px",
                height: "160px",
                borderRadius: "8px",
                background:
                  "radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />
            {/* Art frame container */}
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "8px",
                overflow: "hidden",
                border: "6px solid #D4AF37",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(212, 175, 55, 0.3)",
              }}
            >
              <img
                src={PROJECT_AVATAR_URL}
                alt="Creator avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* Project title with elegant typography */}
          <h1
            style={{
              fontSize: PROJECT_TITLE.length > 25 ? "78px" : "88px",
              fontWeight: "900",
              color: "#ffffff",
              textAlign: "center",
              marginBottom: "32px",
              lineHeight: 1.1,
              letterSpacing: "-3px",
              textShadow: "0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(212, 175, 55, 0.3)",
              maxWidth: "1100px",
              fontFamily: "system-ui, -apple-system, sans-serif",
              whiteSpace: PROJECT_TITLE.length > 40 ? "normal" : "nowrap",
              paddingLeft: "20px",
              paddingRight: "20px",
              background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {PROJECT_TITLE}
          </h1>

          {/* Project description */}
          <p
            style={{
              fontSize: "42px",
              fontWeight: "500",
              color: "rgba(255, 255, 255, 0.9)",
              textAlign: "center",
              marginBottom: "56px",
              lineHeight: 1.3,
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
              maxWidth: "900px",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.5px",
            }}
          >
            {PROJECT_DESCRIPTION}
          </p>

          {/* Gallery exhibition label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              padding: "24px 48px",
              backgroundColor: "rgba(26, 26, 46, 0.8)",
              borderRadius: "16px",
              border: "2px solid rgba(212, 175, 55, 0.6)",
              backdropFilter: "blur(15px)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Gallery icon */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                display: "block",
              }}
            >
              <rect x="3" y="3" width="18" height="14" rx="2" stroke="#D4AF37" strokeWidth="2" fill="none"/>
              <rect x="6" y="6" width="4" height="3" rx="1" fill="#D4AF37"/>
              <rect x="11" y="6" width="6" height="5" rx="1" fill="#8A63D2"/>
              <rect x="6" y="10" width="6" height="4" rx="1" fill="#1E90FF"/>
              <rect x="14" y="12" width="3" height="2" rx="1" fill="#D4AF37"/>
              <path d="M3 21l18 0" stroke="#D4AF37" strokeWidth="2"/>
            </svg>
            <span
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: "0.5px",
              }}
            >
              Digital Art Gallery
            </span>
          </div>
        </div>

        {/* Bottom gradient fade for depth */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
