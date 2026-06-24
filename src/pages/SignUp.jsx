import { useState } from "react";
import axios from "axios";

export default function SignUp() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        form
      );

      alert(response.data.message);

      setForm({
        fullName: "",
        email: "",
        phone: "",
        username: "",
        password: "",
      });

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center pt-10 pb-10">

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border py-8 px-4 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold text-center">
          Create account
        </h1>

        <div className="flex flex-col gap-3 mt-6">

          <input
            type="text"
            placeholder="Full name"
            value={form.fullName}
            onChange={update("fullName")}
            className="border p-3 rounded"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={update("email")}
            className="border p-3 rounded"
          />

          <input
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={update("phone")}
            className="border p-3 rounded"
          />

          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={update("username")}
            className="border p-3 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={update("password")}
            className="border p-3 rounded"
          />

          <button
            disabled={loading}
            className="bg-pink-500 text-white py-3 rounded"
          >
            {loading
              ? "Creating..."
              : "Create account"}
          </button>

        </div>
      </form>

    </div>
  );
}