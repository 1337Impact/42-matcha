import { useState } from "react";
import { loginSchema } from "../../utils/zod/loginSchema";
import { Link } from "react-router-dom";
import axios from "axios";

export default function SignInForm() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const onSubmit = async () => {
    setError({
      email: "",
      password: "",
    });
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        setError((prev) => ({ ...prev, [err.path[0]]: err.message }));
      });
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        data
      );
      console.log(response);
      window.localStorage.setItem("token", response.data.token);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="mb-4">
        <label
          className="block text-gray-600 text-sm font-bold mb-1"
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
          id="email"
          type="email"
          required={false}
          placeholder="Email Address"
          onChange={handleChange}
        />
        <p className="text-red-500 text-xs italic">{error.email}</p>
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-600 text-sm font-bold mb-1"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
          id="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <p className="text-red-500 text-xs italic">{error.password}</p>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded"
          onClick={onSubmit}
        >
          Sign In
        </button>
      </div>
      <div>
        <p className="text-gray-600 text-sm mt-3">
          Already have an account? <Link className="text-blue-500" to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
