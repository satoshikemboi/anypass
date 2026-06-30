import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "https://anypass.onrender.com/api/auth/signup",
        form
      );
      alert(response.data.message);
      setForm({ fullName: "", email: "", phone: "", username: "", password: "" });
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        min-h-screen
        flex
        justify-center
        items-start
        px-4
        py-10
      `}
    >
      <form
        onSubmit={handleSubmit}
        className={`
          bg-gray-100
          border
          border-gray-200
          rounded-lg
          shadow-lg
          px-6
          py-8
          w-full
          max-w-md
        `}
      >
        <h1
          className={`
            text-2xl
            font-bold
            text-gray-800
            text-center
            mb-6
          `}
        >
          アカウントを作成
        </h1>

        <div
          className={`
            flex
            flex-col
            gap-2
          `}
        >
          <div className="flex flex-col gap-1">
            <label
              className={`
                text-sm
                font-medium
                text-gray-700
              `}
            >
              氏名
            </label>
            <input
              type="text"
              placeholder="例: 佐藤 結衣"
              value={form.fullName}
              onChange={update("fullName")}
              className={inputClass}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className={`
                text-sm
                font-medium
                text-gray-700
              `}
            >
              メールアドレス
            </label>
            <input
              type="email"
              placeholder="例: jane@example.com"
              value={form.email}
              onChange={update("email")}
              className={inputClass}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className={`
                text-sm
                font-medium
                text-gray-700
              `}
            >
              電話番号
            </label>
            <input
              type="tel"
              placeholder="例: 08028237064"
              value={form.phone}
              onChange={update("phone")}
              className={inputClass}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className={`
                text-sm
                font-medium
                text-gray-700
              `}
            >
              ユーザー名
            </label>
            <input
              type="text"
              placeholder="例: yuki_123"
              value={form.username}
              onChange={update("username")}
              className={inputClass}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className={`
                text-sm
                font-medium
                text-gray-700
              `}
            >
              パスワード
            </label>
            <input
              type="password"
              placeholder="例: 6文字以上"
              value={form.password}
              onChange={update("password")}
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
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
              mt-1
            `}
          >
            {loading ? "作成中..." : "アカウントを作成"}
          </button>
        </div>
        <p className="text-center text-md mt-4">
          すでにアカウントをお持ちですか？
          <Link to="/login" className="text-pink-500 ml-1">
            ログイン
          </Link>
        </p>
      </form>
    </div>
  );
}