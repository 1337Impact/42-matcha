import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ImSpinner3 } from "react-icons/im";
import { passwordUpdateSchema } from "../../../../utils/zod/passwordUpdateSchema";

export default function UpdatePasswordForm() {
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(data);
  const [updateError, setUpdateError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setError({
      password: "",
      confirmPassword: "",
    });
    
    const result = passwordUpdateSchema.safeParse(data);
    if (!result.success) {
      result.error.errors.forEach((err : any) => {
        setError((prev) => ({ ...prev, [err.path[0]]: err.message }));
      });
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/auth/reset-password/`,
        { password: data.password, token: token }
      );
      setRedirecting(true);
      navigate("/");
    } catch (error: any) {
      setUpdateError(error.message);
      setLoading(false);
    }
  };

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
        <p className="text-red-500 text-sm font-medium pb-2">{updateError}</p>
        <div className="mb-4">
          <label
            className="block text-gray-600 text-sm font-bold mb-1"
            htmlFor="password"
          >
            New Password
          </label>
          <input
            autoFocus
            className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
            id="password"
            type="password"
            placeholder="Enter your new password"
            onChange={handleChange}
          />
          <p className="text-red-500 text-xs italic">{error.password}</p>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-600 text-sm font-bold mb-1"
            htmlFor="confirmPassword"
          >
            Confirm New Password
          </label>
          <input
            className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
            id="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            onChange={handleChange}
          />
          <p className="text-red-500 text-xs italic">{error.confirmPassword}</p>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded"
            type="submit"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
