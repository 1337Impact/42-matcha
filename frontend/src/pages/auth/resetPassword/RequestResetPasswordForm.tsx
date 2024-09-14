import { useState } from "react";
import axios from "axios";

export default function RequestResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleForgetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/request-reset-password`,
        { email: email }
      );
      setSuccessMessage(response.data.message);
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto relative">
      <form onSubmit={handleForgetPassword}>
        <div className="mb-4">
          <label
            className="block text-gray-600 text-sm font-bold mb-1"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            autoFocus
            className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
            id="email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={handleChange}
          />
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-xs italic">{successMessage}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
