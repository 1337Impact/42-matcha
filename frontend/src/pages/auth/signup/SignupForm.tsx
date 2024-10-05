import { useState } from "react";
import { signupSchema } from "../../../utils/zod/signupSchema";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SingUpForm({
  setStatus,
  setSignUpError,
}: {
  setStatus: (status: string) => void;
  setSignUpError: (status: string) => void;
}) {
  const [data, setData] = useState({
    email: "",
    username: "",
    last_name: "",
    first_name: "",
    password: "",
  });
  const [error, setError] = useState(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const onSubmit = async () => {
    setError({
      email: "",
      username: "",
      last_name: "",
      first_name: "",
      password: "",
    });
    const result = signupSchema.safeParse(data);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        setError((prev) => ({ ...prev, [err.path[0]]: err.message }));
      });
      return;
    }
    try {
      setStatus("loading");
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/auth/signup`,
        data
      );
      setStatus("success");
      // window.localStorage.setItem("token", response.data.token);
      //response);
    } catch (error: any) {
      setStatus("failed");
      setSignUpError(error.response.data.error);
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="mb-3">
        <label
          className="block text-gray-600 text-sm font-bold mb-1"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
          id="email"
          type="email"
          name="email"
          required={false}
          placeholder="Email"
          onChange={handleChange}
        />
        {error.email && (
          <p className="text-red-400 font-medium text-xs -mb-[8px]">
            {error.email}
          </p>
        )}
      </div>
      <div className="mb-3">
        <label
          className="block text-gray-600 text-sm font-bold mb-1"
          htmlFor="username"
        >
          Username
        </label>
        <input
          className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          onChange={handleChange}
        />
        {error.username && (
          <p className="text-red-400 font-medium text-xs -mb-[8px]">
            {error.username}
          </p>
        )}
      </div>
      <div className="flex gap-2 w-full">
        <div className="mb-3 w-full">
          <label
            className="block text-gray-600 text-sm font-bold mb-1"
            htmlFor="first_name"
          >
            First Name
          </label>
          <input
            className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
            id="first_name"
            name="first_name"
            type="text"
            placeholder="First Name"
            onChange={handleChange}
          />
          {error.first_name && (
            <p className="text-red-400 font-medium text-xs -mb-[8px]">
              {error.first_name}
            </p>
          )}
        </div>
        <div className="mb-3 w-full">
          <label
            className="block text-gray-600 text-sm font-bold mb-1"
            htmlFor="last_name"
          >
            Last Name
          </label>
          <input
            className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
            id="last_name"
            name="last_name"
            type="text"
            placeholder="Last Name"
            onChange={handleChange}
          />
          {error.last_name && (
            <p className="text-red-400 font-medium text-xs -mb-[8px]">
              {error.last_name}
            </p>
          )}
        </div>
      </div>
      <div className="mb-5">
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
        {error.password && (
          <p className="text-red-400 font-medium text-xs -mb-[8px]">
            {error.password}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded"
          onClick={onSubmit}
        >
          Sign Up
        </button>
      </div>
      <div>
        <p className="text-gray-600 text-sm mt-3">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
