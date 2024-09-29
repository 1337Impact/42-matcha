import { Divider } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { IoLogoFacebook } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../../../utils/zod/loginSchema";

export default function SignInForm() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(data);
  const [singInError, setSignInError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
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
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/auth/login`,
        data
      );
      //"login res: ", response);
      window.localStorage.setItem("token", response.data.token);
      const isProfileCompleted = response.data.isProfileCompleted;
      setRedirecting(true);
      navigate(`/${!isProfileCompleted ? "?profilecompleted=false" : ""}`);
      navigate(`/${!isProfileCompleted ? "?profilecompleted=false" : ""}`);
      // setTimeout(() => {
      // }, 1000);
    } catch (error: any) {
      setSignInError(error.message);
      //error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      window.localStorage.setItem("token", token);
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="w-full mx-auto relative">
      <form onSubmit={onSubmit}>
        <div
          className={`${
            !loading && "hidden"
          } absolute flex justify-center flex-col items-center w-full h-full bg-[rgba(255,255,255,0.44)]`}
        >
          <ImSpinner3 className="animate-spin w-12 h-12" />
          {redirecting && (
            <p className="text-gray-600 text-sm font-medium">Redirecting...</p>
          )}
        </div>
        <p className="text-red-500 text-sm font-medium pb-2">{singInError}</p>
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

          <Link
            className="text-blue-400 text-xs italic text-end justify-self-end"
            to="/resetPassword"
          >
            Forget password ?{" "}
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded"
            // onClick={onSubmit}
            type="submit"
          >
            Sign In
          </button>
        </div>
      </form>
      <div>
        <p className="text-gray-600 text-sm mt-3">
          Already have an account?{" "}
          <Link className="text-blue-500" to="/signup">
            Sign Up
          </Link>
        </p>
      </div>
      {/* Instagram and facebook  */}
      <div className="flex-col items-center justify-center gap-4 mt-6">
        <div className="flex items-center text-center justify-center gap-4 w-full">
          <Divider
            sx={{
              height: 0.5,
              width: "35%",
              bgcolor: "black",
            }}
          />
          <div className="text-gray-500 text-sm text-center">
            Or Sign In with
          </div>
          <Divider
            sx={{
              height: 0.5,
              width: "35%",
              bgcolor: "black",
            }}
          />
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_APP_API_URL}/auth/facebook`;
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center "
          >
            <IoLogoFacebook className="w-12 h-12" />
          </button>
          {/* <button className="w-12 h-12 rounded-full flex items-center justify-center">
            <IoLogoInstagram onClick={handSignInInsta} className="w-12 h-12" />
          </button> */}
        </div>
      </div>
    </div>
  );
}
