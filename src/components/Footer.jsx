import React from "react";

const LINKS = [
  { label: "ご利用方法", href: "#" },
  { label: "ヘルプ・お問い合わせ", href: "#" },
  { label: "利用規約", href: "#" },
  { label: "特定商取引に関する表記", href: "#" },
  { label: "プライバシーポリシー", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#F01A5C] px-6 py-10 sm:py-12">
      <nav
        aria-label="フッターナビゲーション"
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4"
      >
        {LINKS.map((link, i) => (
          <React.Fragment key={link.label}>
            <a
              href={link.href}
              className="text-[12px] sm:text-[13px] font-medium tracking-wide text-white/95 whitespace-nowrap transition-colors hover:text-white hover:underline underline-offset-4"
            >
              {link.label}
            </a>
            {i < LINKS.length - 1 && (
              <span aria-hidden="true" className="text-white/50 text-[12px] select-none">
                |
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>

      <p className="mt-6 text-center text-[12px] sm:text-[13px] font-light tracking-wide text-white/90">
        © avex live creative
      </p>
    </footer>
  );
}