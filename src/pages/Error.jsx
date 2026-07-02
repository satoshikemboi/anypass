import { useNavigate } from "react-router-dom";

/* ── Design tokens ──────────────────────────────────────────── */

const PAPER      = "#FAF5EC"; // page background, warm ticket paper
const INK        = "#211815"; // primary text / CTA
const INK_SOFT   = "#8A7B6C"; // secondary text
const STUB_RED   = "#C8102E"; // error / accent
const RED_TINT   = "#F7E1DF"; // soft red fill
const HAIRLINE   = "#E4D7C4"; // dividers, borders
const GREEN      = "#2F7A4F";
const GREEN_TINT = "#E9F2EC";

const FONT_DISPLAY = "'Zen Kaku Gothic New', 'Hiragino Sans', sans-serif";
const FONT_MONO    = "'JetBrains Mono', 'SFMono-Regular', monospace";

/* ── Icons ──────────────────────────────────────────────────── */

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ChainIcon({ color = STUB_RED, size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d="M9 15 15 9" />
      <path d="M11 6l1.5-1.5a3.54 3.54 0 0 1 5 5L16 11" />
      <path d="M13 18l-1.5 1.5a3.54 3.54 0 0 1-5-5L8 13" />
    </svg>
  );
}

function LockIcon({ color = "#fff", size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

/* ── Signature visual: two ticket stubs bound at the seam ────── */

function LinkedStubsGraphic() {
  return (
    <svg
      viewBox="0 0 240 132"
      className="w-full max-w-[220px] h-auto mx-auto"
      style={{ transform: "rotate(-1.2deg)" }}
      aria-hidden="true"
    >
      {/* connecting stitch line, peeks above/below the seal */}
      <line x1="120" y1="14" x2="120" y2="118" stroke={INK_SOFT} strokeWidth="1.5" strokeDasharray="1 5" strokeLinecap="round" />

      {/* left stub */}
      <rect x="16" y="14" width="96" height="104" rx="12" fill="#FFFFFF" stroke={INK} strokeWidth="1.4" />
      {/* right stub */}
      <rect x="128" y="14" width="96" height="104" rx="12" fill="#FFFFFF" stroke={INK} strokeWidth="1.4" />

      {/* perforation notches faking a torn edge between the two stubs */}
      <circle cx="112" cy="38" r="6.5" fill={PAPER} stroke={INK} strokeWidth="1.2" />
      <circle cx="112" cy="94" r="6.5" fill={PAPER} stroke={INK} strokeWidth="1.2" />
      <circle cx="128" cy="38" r="6.5" fill={PAPER} stroke={INK} strokeWidth="1.2" />
      <circle cx="128" cy="94" r="6.5" fill={PAPER} stroke={INK} strokeWidth="1.2" />

      {/* date labels */}
      <text x="64" y="52" textAnchor="middle" fontFamily={FONT_MONO} fontSize="15" fontWeight="700" fill={INK}>7.11</text>
      <text x="64" y="70" textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize="9.5" fill={INK_SOFT}>1公演目</text>
      <text x="176" y="52" textAnchor="middle" fontFamily={FONT_MONO} fontSize="15" fontWeight="700" fill={INK}>7.12</text>
      <text x="176" y="70" textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize="9.5" fill={STUB_RED}>譲渡対象</text>

      {/* seal binding the two stubs together */}
      <circle cx="120" cy="66" r="19" fill={STUB_RED} stroke={PAPER} strokeWidth="4" />
      <g transform="translate(112,58)">
        <LockIcon color="#fff" size="16" />
      </g>
    </svg>
  );
}

/* ── Small building blocks ────────────────────────────────────── */

function TicketRow({ date, day, note, highlight }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-baseline gap-2">
        <span style={{ fontFamily: FONT_MONO, color: INK }} className="text-[15px] font-bold">
          {date}
        </span>
        <span style={{ color: INK_SOFT }} className="text-[12px]">{day}</span>
      </div>
      <span
        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
        style={
          highlight
            ? { backgroundColor: RED_TINT, color: STUB_RED }
            : { backgroundColor: "#F1EBE0", color: INK_SOFT }
        }
      >
        {note}
      </span>
    </div>
  );
}

function StepRow({ n, children }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
        style={{ backgroundColor: INK, color: PAPER, fontFamily: FONT_MONO }}
      >
        {n}
      </span>
      <p className="text-[13px] leading-relaxed" style={{ color: INK }}>{children}</p>
    </div>
  );
}

/* ── Error Page ─────────────────────────────────────────────── */

export default function Error() {
  const navigate = useNavigate();

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
      />
      <style>{`
        .anypass-cta:focus-visible {
          outline: 3px solid ${STUB_RED};
          outline-offset: 3px;
        }
      `}</style>

      <div
        className="min-h-screen p-5 flex flex-col"
        style={{ backgroundColor: PAPER, fontFamily: FONT_DISPLAY }}
      >
        <div className="w-full max-w-sm mx-auto flex flex-col flex-1">

          {/* Eyebrow */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STUB_RED }} />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: STUB_RED, fontFamily: FONT_MONO }}
              >
                Transfer Error
              </span>
            </div>
            <span className="text-[11px]" style={{ color: INK_SOFT, fontFamily: FONT_MONO }}>
              #SET-0711712
            </span>
          </div>

          {/* Signature visual */}
          <div className="mb-6">
            <LinkedStubsGraphic />
          </div>

          {/* Headline + body */}
          <div className="text-center mb-8">
            <h1 className="text-[21px] font-black leading-snug mb-3" style={{ color: INK }}>
              7/12だけの譲渡はできません
            </h1>
            <p className="text-[13.5px] leading-relaxed" style={{ color: INK_SOFT }}>
              7/11・7/12は購入時に連番でセットになっているチケットです。@nami215さんへの譲渡には、両日分をまとめて指定してください。
            </p>
          </div>

          {/* Ticket detail card */}
          <div
            className="rounded-2xl bg-white px-5 pt-5 pb-5 mb-4"
            style={{ border: `1px solid ${HAIRLINE}` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <ChainIcon />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.1em]"
                style={{ color: INK_SOFT, fontFamily: FONT_MONO }}
              >
                連番チケット・2枚セット
              </span>
            </div>

            <div className="relative pl-6">
              <div
                className="absolute left-[5px] top-1 bottom-1 w-px"
                style={{ backgroundImage: `linear-gradient(${HAIRLINE} 60%, transparent 0%)`, backgroundSize: "1px 6px", backgroundRepeat: "repeat-y" }}
              />
              <div
                className="absolute left-[5px] top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: STUB_RED }}
              >
                <LockIcon />
              </div>
              <div className="space-y-4">
                <TicketRow date="7.11" day="（土）EXO PLANET Japan" note="1公演目" />
                <TicketRow date="7.12" day="（日）EXO PLANET Japan" note="譲渡対象" highlight />
              </div>
            </div>

            <div className="my-5 border-t border-dashed" style={{ borderColor: HAIRLINE }} />

            <p
              className="text-[11px] font-bold uppercase tracking-[0.1em] mb-3"
              style={{ color: INK_SOFT, fontFamily: FONT_MONO }}
            >
              対応方法
            </p>
            <div className="space-y-3">
              <StepRow n="1">譲渡画面で7/11・7/12の両方にチェックを入れる</StepRow>
              <StepRow n="2">内容を確認し、譲渡を再送信する</StepRow>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-[11.5px] text-center leading-relaxed mb-6" style={{ color: INK_SOFT }}>
            対応が難しい場合は、AnyPASSヘルプセンターまでお問い合わせください。
          </p>

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="anypass-cta w-full py-3.5 rounded-2xl text-[14px] font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99] active:opacity-90 mt-auto"
            style={{ backgroundColor: INK, color: PAPER }}
          >
            <ArrowLeftIcon />
            前のページに戻る
          </button>

        </div>
      </div>
    </>
  );
}