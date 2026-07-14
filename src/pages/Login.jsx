import { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // This reads the page they tried to access before being redirected
  const from = location.state?.from?.pathname || "/tickets";

  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null); // { type: "success" | "error", text: string }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMsg(null);

    try {
      setLoading(true);

      const response = await axios.post(
        "https://anypass.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      setAlertMsg({ type: "success", text: response.data.message });

      // Save user/token
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      /* =======================================================
         FIX: Dynamically redirect back to the intercepted route
         ======================================================= */
      setTimeout(() => navigate(from, { replace: true }), 800);
    } catch (error) {
      setAlertMsg({
        type: "error",
        text: error.response?.data?.message || "ログインに失敗しました",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-24 px-6">
      <p className="text-sm text-gray-700 mb-4 max-w-lg font-semibold w-full">
        チケットを購入するにはログインが必要です。
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 rounded-lg shadow-lg p-8 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold text-center">ログイン</h1>

        <p className="text-sm text-center text-gray-500 mb-6">
          メールアドレスでログイン
        </p>

        {alertMsg && (
          <div
            role="alert"
            className={`
              flex items-center justify-between
              text-sm
              rounded-md
              px-4 py-3
              mb-4
              ${alertMsg.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"}
            `}
          >
            <span>{alertMsg.text}</span>
            <button
              type="button"
              onClick={() => setAlertMsg(null)}
              aria-label="閉じる"
              className="ml-3 text-lg leading-none opacity-60 hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="anypass@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-pink-300 rounded-md p-2.5 outline-none"
          />

          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-pink-300 rounded-md p-2.5 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-400 hover:bg-pink-600 text-white py-3 rounded"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </div>

        <p className="text-center mt-4">
          アカウントをお持ちでない方は
          <Link to="/signup" className="text-pink-500 ml-1">
            登録
          </Link>
        </p>
      </form>
    </div>
  );
}