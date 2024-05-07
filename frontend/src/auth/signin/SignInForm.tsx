import { useState } from "react";
import { loginSchema } from "../../utils/zod/loginSchema";
import { Link } from "react-router-dom";

export default function SignInForm() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.id, e.target.value);
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const onSubmit = async () => {
    setError({
      email: "",
      password: "",
    });
    try {
      const result = loginSchema.parse(data);
      console.log(result);
    } catch (error: any) {
      error.issues.reduce((acc: any, issue: any) => {
        setError((prev) => ({ ...prev, [issue.path[0]]: issue.message }));
        return acc;
      }, {} as Record<string, string>);
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
          Already have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
