import { useState } from "react";

const buttons = [
  {
    label: "PayPay ID",
    sub: "Payment administration",
    href: "./paymentadmin",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    theme: {
      bg: "#FBEAF0",
      bgHover: "#F4C0D1",
      border: "#ED93B1",
      borderHover: "#D4537E",
      text: "#72243E",
      iconBg: "#F4C0D1",
      dot: "#D4537E",
    },
  },
  {
    label: "Users",
    sub: "Manage user accounts",
    href: "./yukiadmin",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
      </svg>
    ),
    theme: {
      bg: "#EEEDFE",
      bgHover: "#CECBF6",
      border: "#AFA9EC",
      borderHover: "#7F77DD",
      text: "#3C3489",
      iconBg: "#CECBF6",
      dot: "#7F77DD",
    },
  },
  {
    label: "Generate Ticket",
    sub: "Create & issue tickets",
    href: "./ticketadmin",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
        <line x1="9" y1="12" x2="15" y2="12" strokeDasharray="2 2" />
      </svg>
    ),
    theme: {
      bg: "#E1F5EE",
      bgHover: "#9FE1CB",
      border: "#5DCAA5",
      borderHover: "#1D9E75",
      text: "#085041",
      iconBg: "#9FE1CB",
      dot: "#1D9E75",
    },
  },
];

function AdminButton({ label, sub, href, icon, theme }) {
  const [hovered, setHovered] = useState(false);

  const btnStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.1rem 1.4rem",
    borderRadius: "14px",
    border: `1.5px solid ${hovered ? theme.borderHover : theme.border}`,
    background: hovered ? theme.bgHover : theme.bg,
    cursor: "pointer",
    textDecoration: "none",
    color: theme.text,
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.15s ease, background 0.15s ease, border-color 0.15s ease",
    transform: hovered ? "translateY(-2px)" : "translateY(0)",
    width: "100%",
  };

  const iconWrapStyle = {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    background: theme.iconBg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: theme.text,
  };

  const dotStyle = {
    position: "absolute",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    right: "-20px",
    top: "-20px",
    background: theme.dot,
    opacity: 0.12,
    pointerEvents: "none",
  };

  return (
    <a
      href={href}
      style={btnStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={dotStyle} />
      <div style={iconWrapStyle}>{icon}</div>
      <div style={{ flex: 1, textAlign: "left" }}>
        <span style={{ fontSize: "15px", fontWeight: 500, display: "block", lineHeight: 1.2 }}>
          {label}
        </span>
        <span style={{ fontSize: "12px", display: "block", marginTop: "2px", opacity: 0.75 }}>
          {sub}
        </span>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  );
}

export default function AdminPanel() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#993556",
              marginBottom: "0.5rem",
            }}
          >
            Admin Panel
          </p>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 500,
              color: "#4B1528",
              margin: 0,
            }}
          >
            What would you like to manage?
          </h1>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "100%",
          }}
        >
          {buttons.map((btn) => (
            <AdminButton key={btn.label} {...btn} />
          ))}
        </div>

        {/* Footer dots */}
        <div style={{ display: "flex", gap: "6px" }}>
          {["#ED93B1", "#AFA9EC", "#5DCAA5"].map((color) => (
            <div
              key={color}
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: color,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}