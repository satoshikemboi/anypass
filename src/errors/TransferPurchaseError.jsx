
import React from "react";
import { Link } from "react-router-dom";
import { Ban, Info, RotateCcw, Ticket } from "lucide-react";

export default function TransferPurchaseError({
  user = "aki",
  onSelectTickets = () => {},
}) {
  return (
    <div className="w-full max-w-md mx-auto min-h-screen rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Error Icon */}
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
        <Ban
          className="h-5 w-5 text-red-600"
          aria-hidden="true"
        />
      </div>

      {/* Notification Heading */}
      <h2 className="mt-4 text-base font-medium text-neutral-900">
        購入手続きに問題があります
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        お客様の購入手続きは無効となりました。
        チケット3枚を同時に選択して購入する必要があるため、
        現在のご注文は完了できません。
      </p>

      {/* Refund Information */}
      <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-red-50 p-3">
        <RotateCcw
          className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
          aria-hidden="true"
        />

        <p className="text-sm leading-relaxed text-neutral-700">
          <span className="font-medium text-neutral-900">
            @{user}
          </span>
          さん、お支払い済みの金額はイベント終了後に返金される予定です。
          返金が完了するまで、しばらくお待ちください。
        </p>
      </div>

      {/* Instructions */}
      <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-neutral-50 p-3">
        <Info
          className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500"
          aria-hidden="true"
        />

        <p className="text-sm leading-relaxed text-neutral-600">
          新しい注文を作成するには、3枚すべてのチケットを選択し、
          まとめて購入手続きを行ってください。
        </p>
      </div>

      {/* Ticket Count */}
      <div className="mt-5 flex items-center justify-between rounded-lg border border-neutral-200 p-4">
        <div className="flex items-center gap-3">
          <Ticket
            className="h-5 w-5 text-neutral-700"
            aria-hidden="true"
          />

          <div>
            <p className="text-sm font-medium text-neutral-900">
              新しい注文
            </p>
            <p className="text-xs text-neutral-500">
              3枚のチケットをまとめて購入
            </p>
          </div>
        </div>

        <span className="rounded-md bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
          3枚
        </span>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onSelectTickets}
        className="mt-6 flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        3枚のチケットを選択する
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-neutral-500">
        ご不明な点がございましたら、サポートまでお問い合わせください。
      </p>
    </div>
  );
}