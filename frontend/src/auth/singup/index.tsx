import { useState } from "react";
import { singupSchema } from "../../utils/zod/singupSchema";
export default function SingUp() {
  const [data, setData] = useState({
    email: "",
    username: "",
    lastName: "",
    firstName: "",
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
      username: "",
      lastName: "",
      firstName: "",
      password: "",
    });
    try {
      const result = singupSchema.parse(data);
      console.log(result);
    } catch (error: any) {
      error.issues.reduce((acc: any, issue: any) => {
        setError((prev) => ({ ...prev, [issue.path[0]]: issue.message }));
        return acc;
      }, {} as Record<string, string>);
    }
  };

  return (
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            required={false}
            placeholder="Email"
            onChange={handleChange}
          />
          <p className="text-red-500 text-xs italic">{error.email}</p>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            onChange={handleChange}
          />
          <p className="text-red-500 text-xs italic">{error.username}</p>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="lastName"
            type="text"
            placeholder="Last Name"
            onChange={handleChange}
          />
          <p className="text-red-500 text-xs italic">{error.lastName}</p>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="firstName"
            type="text"
            placeholder="First Name"
            onChange={handleChange}
          />
          <p className="text-red-500 text-xs italic">{error.firstName}</p>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <p className="text-red-500 text-xs italic">{error.password}</p>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onSubmit}
          >
            Sign Up
          </button>
        </div>
      </div>
  );
}
