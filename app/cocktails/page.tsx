import Link from "next/link"

const cocktails = [
  {
    code: "PHOENIX DOWN",
    subtitle: "Corpse Reviver No. 1",
    type: "ALCOHOLIC",
    color: "#ff8844",
    icon: "🍊",
    effect: "REVIVES FALLEN PARTY MEMBERS",
    ingredients: [
      "45ml Cognac (Remy Martin VSOP)",
      "25ml Apple Brandy / Calvados",
      "25ml Carpano Antica Sweet Vermouth",
      "2 dashes Orange Bitters",
    ],
    instructions: [
      "Add all ingredients to mixing glass with ice",
      "Stir for 15-20 seconds to chill and dilute",
      "Strain into a chilled coupe glass",
      "Garnish with an orange peel",
    ],
    stats: { STR: 8, AGI: 6, INT: 9 },
  },
  {
    code: "HP TONIC",
    subtitle: "Gin & Tonic",
    type: "ALCOHOLIC",
    color: "#44ff88",
    icon: "🍋",
    effect: "RESTORES 50 HP",
    ingredients: [
      "50ml Raksasa Gin (Original)",
      "150ml Premium Tonic Water",
      "1 Wedge of Lime",
    ],
    instructions: [
      "Fill glass to brim with fresh ice",
      "Pour gin over the ice",
      "Top with chilled premium tonic water",
      "Squeeze lime wedge into drink, then drop it in",
      "Gently stir once — do not over-stir",
    ],
    stats: { STR: 5, AGI: 9, INT: 7 },
  },
  {
    code: "PEACEFUL DAYS",
    subtitle: "Piña Colada",
    type: "ALCOHOLIC",
    color: "#ffdd44",
    icon: "🍍",
    effect: "GRANTS BUFF: RELAXED",
    ingredients: [
      "50ml White Rum (Bacardi)",
      "30ml Coconut Cream",
      "50ml Fresh Pineapple Juice",
      "Squeeze of Lime Juice",
      "Optional: 3 Strawberries (to blend)",
    ],
    instructions: [
      "Blend all ingredients with ice in electric blender",
      "Pour into a large glass and serve with straws",
      "Garnish with maraschino cherry or pineapple slice",
    ],
    stats: { STR: 6, AGI: 5, INT: 8 },
  },
  {
    code: "MP REFILL",
    subtitle: "Mocktail — Hibiscus Lychee",
    type: "MOCKTAIL",
    color: "#ff44cc",
    icon: "🌺",
    effect: "RESTORES 40 MP — NON-ALCOHOLIC",
    ingredients: [
      "80ml Hibiscus / Rosehip Tea (brewed strong, chilled)",
      "60ml Lychee Juice",
      "20ml Fresh Lime Juice",
      "60ml Soda Water",
      "4 Fresh Mint Leaves",
      "1 Lime Wheel + Lychee (to garnish)",
    ],
    instructions: [
      "Brew hibiscus or rosehip tea strong and chill at double strength",
      "Fill a tall glass generously with ice",
      "Pour 80ml tea, 60ml lychee juice, 20ml lime juice — stir gently",
      "Top with 60ml soda water, pouring slowly down inside of glass",
      "Clap 4 mint leaves between palms, place on top of ice",
      "Add lime wheel + lychee on skewer to garnish",
    ],
    stats: { STR: 3, AGI: 8, INT: 10 },
  },
]

export default function CocktailsPage() {
  return (
    <div className="min-h-screen px-4 py-8" style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* Header */}
      <div className="text-center" style={{ marginBottom: "2.5rem" }}>
        <Link href="/" style={{ fontSize: "0.45rem", color: "#888", textDecoration: "none", display: "block", marginBottom: "1.5rem" }}>
          ← BACK
        </Link>
        <div style={{ fontSize: "0.55rem", color: "#888", marginBottom: "0.5rem", letterSpacing: "0.3em" }}>
          ✦ POWER-UP STATION ✦
        </div>
        <h1 style={{ fontSize: "clamp(1rem, 5vw, 1.5rem)", color: "#ffd700", textShadow: "4px 4px 0 #b8860b" }}>
          COCKTAIL MENU
        </h1>
        <div style={{ fontSize: "0.5rem", color: "#888", marginTop: "0.5rem" }}>
          EIZAZ&apos;S LEVEL 40 UNLOCKED
        </div>
      </div>

      {/* Legend */}
      <div className="pixel-panel flex gap-6 justify-center" style={{ padding: "0.75rem", marginBottom: "2rem", fontSize: "0.45rem" }}>
        <span style={{ color: "#ffd700" }}>■ ALCOHOLIC</span>
        <span style={{ color: "#ff44cc" }}>■ MOCKTAIL</span>
        <span style={{ color: "#888" }}>DRINK RESPONSIBLY</span>
      </div>

      {/* Cocktail cards */}
      <div className="flex flex-col gap-6">
        {cocktails.map(c => (
          <div
            key={c.code}
            className="pixel-card"
            style={{ padding: "1.5rem", borderColor: c.color, boxShadow: `8px 8px 0 0 ${c.color}33` }}
          >
            {/* Item header */}
            <div className="flex items-start justify-between gap-3" style={{ marginBottom: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: c.color, marginBottom: "0.2rem" }}>
                  {c.icon} {c.code}
                </div>
                <div style={{ fontSize: "0.5rem", color: "#aaa" }}>{c.subtitle}</div>
              </div>
              <div className="pixel-panel" style={{
                padding: "0.3rem 0.5rem",
                fontSize: "0.4rem",
                color: c.type === "MOCKTAIL" ? "#ff44cc" : "#ffd700",
                border: `2px solid ${c.type === "MOCKTAIL" ? "#ff44cc" : "#ffd700"}`,
                whiteSpace: "nowrap",
              }}>
                {c.type}
              </div>
            </div>

            {/* Effect */}
            <div style={{ fontSize: "0.45rem", color: "#00ff88", marginBottom: "1.25rem", fontStyle: "italic" }}>
              EFFECT: {c.effect}
            </div>

            {/* Stats */}
            <div className="flex gap-4" style={{ marginBottom: "1.25rem" }}>
              {Object.entries(c.stats).map(([stat, val]) => (
                <div key={stat} className="text-center">
                  <div style={{ fontSize: "0.4rem", color: "#666" }}>{stat}</div>
                  <div style={{ marginTop: "0.25rem", width: 40 }}>
                    <div style={{ height: 8, background: "#111", border: "2px solid #333" }}>
                      <div style={{ height: "100%", width: `${val * 10}%`, background: c.color }} />
                    </div>
                  </div>
                  <div style={{ fontSize: "0.4rem", color: c.color }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Ingredients */}
            <details>
              <summary style={{ fontSize: "0.5rem", color: "#888", cursor: "pointer", marginBottom: "0.5rem", listStyle: "none" }}>
                ▶ INGREDIENTS &amp; RECIPE
              </summary>
              <div style={{ marginTop: "0.75rem" }}>
                <div style={{ fontSize: "0.45rem", color: "#ffd700", marginBottom: "0.5rem" }}>INGREDIENTS:</div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {c.ingredients.map((ing, i) => (
                    <li key={i} style={{ fontSize: "0.45rem", color: "#aaa", lineHeight: 2, paddingLeft: "0.75rem" }}>
                      · {ing}
                    </li>
                  ))}
                </ul>
                <div style={{ fontSize: "0.45rem", color: "#ffd700", marginTop: "0.75rem", marginBottom: "0.5rem" }}>INSTRUCTIONS:</div>
                <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {c.instructions.map((step, i) => (
                    <li key={i} style={{ fontSize: "0.45rem", color: "#888", lineHeight: 2, paddingLeft: "0.75rem" }}>
                      {i + 1}. {step}
                    </li>
                  ))}
                </ol>
              </div>
            </details>
          </div>
        ))}
      </div>

      {/* Inventory note */}
      <div className="pixel-card" style={{ padding: "1.25rem", marginTop: "2rem", borderColor: "#333" }}>
        <div style={{ fontSize: "0.5rem", color: "#888", marginBottom: "0.75rem" }}>INVENTORY LOADOUT</div>
        <div style={{ fontSize: "0.45rem", color: "#555", lineHeight: 2 }}>
          {[
            "1× Remy Martin Cognac VSOP (700ml)",
            "2× White Rum — Bacardi (700ml)",
            "3× Raksasa Gin (Original)",
            "1× Apple Brandy / Calvados (700ml)",
            "1× Carpano Antica Sweet Vermouth (700ml)",
            "Orange Bitters",
          ].map((item, i) => (
            <div key={i}>□ {item}</div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link href="/stage" style={{ fontSize: "0.45rem", color: "#00ff88", textDecoration: "none" }}>
          ▶ VIEW LIVE STAGE
        </Link>
      </div>
    </div>
  )
}
