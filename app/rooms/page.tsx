"use client"
import Link from "next/link"

const ROOMS = [
  {
    zone: "ENTRANCE ROOM",
    color: "#9966ff",
    borderColor: "#7744cc",
    icon: "🚪",
    areas: [
      {
        name: "CHARACTER SELECT",
        icon: "📷",
        items: ["Photo booth", "Polaroid printer", "Pixel-art frame"],
      },
      {
        name: "ARCADE VAULT",
        icon: "🕹️",
        items: ["2× retro emulators hooked to TV", "Live leaderboard"],
      },
    ],
    note: "↓ Guests enter here",
  },
  {
    zone: "MAIN STAGE ROOM",
    color: "#00cc66",
    borderColor: "#009944",
    icon: "🎸",
    areas: [
      {
        name: "THE OVERWORLD STAGE",
        icon: "🎺",
        items: [
          "Open mic jam · 16-bit OST set list",
          "Chrono Trigger · FF VI · Contra · Zelda",
          "Birthday moment: live jazz \"Frog's Theme\"",
        ],
        note: "Pixel-art overworld map as backdrop",
      },
      {
        name: "LOOT DROPS",
        icon: "🍟",
        items: [
          "Buffet table · Chachos stash",
          "Loaded potato skins",
          "Berry HP Restore ice cream bar",
        ],
        note: "All items labelled as pixel-art item cards",
      },
      {
        name: "THE INN & TAVERN",
        icon: "🍺",
        items: [
          "Cocktail bar · Pixel-art menu board",
          "Save Point Sour · Elixir of the Ancients",
          "Phoenix Down · MP Refill milkshake bar",
        ],
        note: "Back wall of main room",
      },
    ],
  },
  {
    zone: "SIDE ROOM A",
    color: "#4488ff",
    borderColor: "#2255cc",
    icon: "🥽",
    areas: [
      {
        name: "ENTER THE ISEKAI",
        icon: "🥽",
        items: [
          "2× Meta Quest 3 hooked to TV screen",
          "Beat Saber · VR worlds",
          "5-min guest slots",
        ],
        note: "Isekai / anime VR worlds",
      },
    ],
  },
  {
    zone: "SIDE ROOM B",
    color: "#4488ff",
    borderColor: "#2255cc",
    icon: "🌙",
    areas: [
      {
        name: "THE SAVE POINT",
        icon: "🌙",
        items: [
          "Quiet chill room · Low seating",
          "Soft lighting · Ambient FF piano playlist",
          "Good conversation corner",
        ],
        note: "For guests needing a breather",
      },
    ],
  },
  {
    zone: "BACK / SEPARATE",
    color: "#aa7733",
    borderColor: "#885522",
    icon: "🚬",
    areas: [
      {
        name: "THE SCHOLAR'S STUDY",
        icon: "🚬",
        items: ["Separate smoking / cigar room at back"],
      },
    ],
  },
]

export default function RoomsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#050510" }}>

      {/* Header */}
      <div style={{
        textAlign: "center",
        padding: "2rem 1rem 1.5rem",
        borderBottom: "3px solid rgba(255,215,0,0.2)",
        position: "sticky",
        top: 0,
        background: "rgba(5,5,16,0.97)",
        zIndex: 10,
        backdropFilter: "blur(4px)",
      }}>
        <Link href="/" style={{ fontSize: "0.4rem", color: "#555", textDecoration: "none", display: "block", marginBottom: "0.5rem" }}>
          ← BACK
        </Link>
        <div style={{ fontSize: "0.45rem", color: "#888", letterSpacing: "0.4em", marginBottom: "0.3rem" }}>
          ✦ DRUM ASIA LIVE · HARTAMAS ✦
        </div>
        <div style={{ fontSize: "clamp(0.7rem, 3vw, 1rem)", color: "#ffd700", textShadow: "3px 3px 0 #7a5800" }}>
          VENUE MAP
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        justifyContent: "center",
        padding: "1rem",
        borderBottom: "2px solid #111",
      }}>
        {[
          { color: "#9966ff", label: "ENTRANCE" },
          { color: "#00cc66", label: "MAIN STAGE" },
          { color: "#4488ff", label: "SIDE ROOMS" },
          { color: "#aa7733", label: "BACK / SEPARATE" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div style={{ width: 10, height: 10, background: l.color, border: "2px solid #000" }} />
            <span style={{ fontSize: "0.4rem", color: "#888" }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Room cards */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem 3rem" }}>
        <div className="flex flex-col gap-4">
          {ROOMS.map(room => (
            <div
              key={room.zone}
              style={{
                border: `3px solid ${room.borderColor}`,
                background: `${room.color}11`,
                padding: "1.25rem",
              }}
            >
              {/* Zone header */}
              <div style={{
                fontSize: "0.55rem",
                color: room.color,
                marginBottom: "1rem",
                letterSpacing: "0.15em",
                borderBottom: `2px solid ${room.borderColor}44`,
                paddingBottom: "0.5rem",
              }}>
                {room.icon} {room.zone}
                {room.note && (
                  <span style={{ fontSize: "0.35rem", color: "#666", marginLeft: "0.75rem", fontStyle: "normal" }}>
                    {room.note}
                  </span>
                )}
              </div>

              {/* Areas inside zone */}
              <div className="flex flex-col gap-3">
                {room.areas.map(area => (
                  <div
                    key={area.name}
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      border: `2px solid ${room.borderColor}55`,
                      padding: "0.75rem 0.9rem",
                    }}
                  >
                    <div style={{ fontSize: "0.5rem", color: "#ffd700", marginBottom: "0.5rem" }}>
                      {area.icon} {area.name}
                    </div>
                    <div className="flex flex-col gap-1">
                      {area.items.map((item, i) => (
                        <div key={i} style={{ fontSize: "0.4rem", color: "#aaa", lineHeight: 1.8 }}>
                          · {item}
                        </div>
                      ))}
                    </div>
                    {area.note && (
                      <div style={{ fontSize: "0.35rem", color: "#666", marginTop: "0.4rem", fontStyle: "italic" }}>
                        ↳ {area.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
