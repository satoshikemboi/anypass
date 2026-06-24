import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response =
        await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email,
            password,
          }
        );

      alert(response.data.message);

      // Save user/token later
      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );

      navigate("/");

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-24 px-4">

      <p className="text-sm text-gray-700 mb-4 max-w-lg font-semibold w-full">
        You need to log in to purchase tickets.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 rounded-lg shadow-lg p-8 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold text-center">
          Log in
        </h1>

        <p className="text-sm text-center text-gray-500 mb-6">
          Log in with your email address
        </p>

        <div className="flex flex-col gap-3">

          <input
            type="email"
            placeholder="anypass@example.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="border border-pink-400 rounded-md p-3 outline-none"
          />

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="border border-pink-400 rounded-md p-3 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-400 hover:bg-pink-600 text-white py-3 rounded"
          >
            {loading
              ? "Logging in..."
              : "Log in"}
          </button>

        </div>

        <p className="text-center mt-4">
          Don't have an account?

          <Link
            to="/signup"
            className="text-pink-500 ml-1"
          >
            Register
          </Link>
        </p>

      </form>

    </div>
  );
}