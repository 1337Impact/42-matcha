import { useEffect, useState } from "react";
import { signupSchema } from "../../utils/zod/signupSchema";
import axios from "axios";
import { Link } from "react-router-dom";

export default function UpdateProfile({
}: {
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
      // setStatus("loading");
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        data
      );
      // setStatus("success");
      // window.localStorage.setItem("token", response.data.token);
      console.log(response);
    } catch (error: any) {
      // setStatus("failed");
      // setSignUpError(error.response.data.error);
    }
  };

  return (
    <div onClick={()=>console.log("close!")} className=" absolute w-full h-full z-30 backdrop-blur-sm">
    <div className="w-[90%] mt-10 rounded-lg mx-auto p-4 bg-gray-100">
      <div className="mb-3">
        <label
          className="block text-gray-600 text-sm font-bold mb-1"
          htmlFor="email"
        >
          gender
        </label>
        <select
            className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
            id="gender"
            // onChange={handleChange}
        >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
        </select>
        {error.email && (
          <p className="text-red-400 font-medium text-xs -mb-[8px]">
            {error.email}
          </p>
        )}
      </div>
      <div className="mb-3">
        
      </div>
        <div className="mb-3 w-full">
          <label
            className="block text-gray-600 text-sm font-bold mb-1"
            htmlFor="first_name"
          >
            Sexual preferences
          </label>
          <select
            className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
            id="gender"
            // onChange={handleChange}
        >
            <option value="">Select Sexual preferences</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
        </select>
          {error.first_name && (
            <p className="text-red-400 font-medium text-xs -mb-[8px]">
              {error.first_name}
            </p>
          )}
        </div>
        <div className="mb-3 w-full">
          <label
            className="block text-gray-600 text-sm font-bold mb-1"
            htmlFor="biography"
          >
            biography
          </label>
          <textarea
            cols={4}
            className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
            id="biography"
            // type="text"
            placeholder="Last Name"
            // onChange={handleChange}
          />
          {error.last_name && (
            <p className="text-red-400 font-medium text-xs -mb-[8px]">
              {error.last_name}
            </p>
          )}
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
    </div>
    </div>
  );
}
