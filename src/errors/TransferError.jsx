import React from "react";
import { Link } from "react-router-dom";
import { Ban, Info } from "lucide-react";

export default function TransferError({
  user = "yui",
  onSelectTicket = () => {},
}) {
  return (
    <div className="w-full max-w-md mx-auto min-h-screen rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
        <Ban className="h-5 w-5 text-red-600" aria-hidden="true" />
      </div>

      <h2 className="mt-4 text-base font-medium text-neutral-900">
        このチケットは単独で譲渡できません
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        このチケットは2枚連番で購入されているため、1枚のみでの譲渡はできません。
      </p>

      <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-neutral-50 p-3">
        <Info
          className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500"
          aria-hidden="true"
        />

        <p className="text-sm leading-relaxed text-neutral-600">
          <span className="font-medium text-neutral-900">@{user}</span>
          さん、もう1枚のtimeleszチケットを選択して購入手続きを完了してください。
          2枚まとめて譲渡できます。
        </p>
      </div>
    </div>
  );
}