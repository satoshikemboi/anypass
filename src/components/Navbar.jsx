const PINK = "#D4537E";

function Navbar() {
  return (
    <nav
      style={{
        background: "#fff",
        borderBottom: "0.5px solid rgba(0,0,0,0.1)",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
      }}
    >
      {/* Left: back chevron + AnyPASS STORE logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          aria-label="Go back"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={PINK}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: PINK,
              letterSpacing: "-0.3px",
            }}
          >
            AnyPASS
          </span>
          <span
            style={{
              background: PINK,
              color: "#fff",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.7px",
              padding: "3px 8px",
              borderRadius: 4,
            }}
          >
            STORE
          </span>
        </div>
      </div>

      {/* Right: user icon + My Page + username */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Person icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={PINK}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>

        <div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 600,
              color: PINK,
              lineHeight: 1.3,
            }}
          >
            My Page
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: "#888",
              lineHeight: 1.3,
            }}
          >
            Satoshi Kemboi
          </p>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;