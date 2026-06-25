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
      alert(error.response?.data?.message || "Signup failed");
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
          Create account
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
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Sato Yui"
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
              Email
            </label>
            <input
              type="email"
              placeholder="e.g. jane@example.com"
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
              Phone
            </label>
            <input
              type="tel"
              placeholder="e.g. 08028237064"
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
              Username
            </label>
            <input
              type="text"
              placeholder="e.g. yuki_123"
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
              Password
            </label>
            <input
              type="password"
              placeholder="e.g. Min. 6 characters"
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
            {loading ? "Creating..." : "Create account"}
          </button>
        </div>
        <p className="text-center text-md mt-4">
          Do you have an account?
          <Link to="/login" className="text-pink-500 ml-1">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}