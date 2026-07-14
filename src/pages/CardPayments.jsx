import { useState } from "react";

const inputClass = `
  border
  border-gray-200
  p-3
  rounded-lg
  w-full
  text-sm
  text-gray-800
  placeholder-gray-400
  outline-none
  focus:border-pink-400
  focus:ring-1
  focus:ring-pink-400
  transition-colors
`;

export default function Payment() {
  const [card, setCard] = useState({
    number: "",
    month: "",
    year: "",
    cvv: "",
  });
  const [saveCard, setSaveCard] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) => {
    setCard({ ...card, [field]: e.target.value });
  };

  const isValid =
    card.number.trim().length > 0 &&
    card.month.trim().length > 0 &&
    card.year.trim().length > 0 &&
    card.cvv.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) {
      setError("カード番号を入力してください");
      return;
    }
    setError("");
    // TODO: send `card` to your payment endpoint
    console.log("Submitting payment:", card);
  };

  return (
    <div className="min-h-screen flex justify-center items-start px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 border border-gray-200 rounded-lg shadow-lg px-6 py-8 w-full max-w-md"
      >
        <h1 className="text-xl font-bold text-gray-800 text-center">
          支払い情報を入力してください
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your payment information
        </p>

        {/* Card brand icons */}
        <div className="flex justify-center gap-2 mb-6">
          <span className="border border-gray-200 rounded px-3 py-1 text-xs font-semibold text-gray-400">
            VISA
          </span>
          <span className="border border-gray-200 rounded px-3 py-1 text-xs font-semibold text-gray-400">
            MC
          </span>
          <span className="border border-gray-200 rounded px-3 py-1 text-xs font-semibold text-gray-400">
            JCB
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {/* Card number */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              カード番号 / Card Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
              value={card.number}
              onChange={update("number")}
              className={inputClass}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {/* Expiry + CVV */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-gray-700">
                有効期限 / Expiry date
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="月 MM"
                  maxLength={2}
                  value={card.month}
                  onChange={update("month")}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="年 YY"
                  maxLength={2}
                  value={card.year}
                  onChange={update("year")}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 w-28">
              <label className="text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="123"
                maxLength={4}
                value={card.cvv}
                onChange={update("cvv")}
                className={inputClass}
              />
            </div>
          </div>

          {/* Save card */}
          <label className="flex items-start gap-2 text-sm text-gray-600 mt-1">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="mt-1"
            />
            <span>
              このカードの情報を保存して、次回も使用する
              <br />
              <span className="text-xs text-gray-400">
                Save this card information, use it again next time
              </span>
            </span>
          </label>

          <button
            type="submit"
            disabled={!isValid}
            className={`
              bg-pink-500
              hover:bg-pink-600
              text-white
              font-medium
              text-sm
              py-3
              rounded-lg
              transition-colors
              disabled:opacity-50
              disabled:cursor-not-allowed
              mt-2
            `}
          >
            確認 / Confirmation
          </button>
        </div>
      </form>
    </div>
  );
}