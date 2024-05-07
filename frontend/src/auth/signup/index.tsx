import { useState } from "react";
import SignUpForm from "./SignupForm";
// import { ImSpinner11 } from "react-icons/im";
import { ImSpinner3 } from "react-icons/im";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";

export default function SingUp() {
  const [status, setStatus] = useState("pending");
  const [signUpError, setSignUpError] = useState("");
  return (
    <div className="w-full flex flex-col justify-center px-8 lg:mx-auto">
      {status == "loading" ? (
        <div className="flex justify-center">
          <ImSpinner3 className="animate-spin w-12 h-12" />
        </div>
      ) : status == "success" ? (
        <div className="flex justify-center flex-col items-center">
          <IoMdCheckmarkCircleOutline className="text-green-500 w-20 h-20" />
          <h2 className="text-3xl font-bold text-gray-800">Congratulations!</h2>
          <p className="text-sm font-semibold text-gray-500">
            Your account has been created successfully
          </p>
          <Link
            to={"/signin"}
            className="flex justify-center bg-gray-700 hover:bg-gray-600 text-white font-bold mt-3 py-1 px-14 rounded"
          >
            Login to your account
          </Link>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-gray-800">
            Create an account
          </h2>
          <h4 className="text-sm font-semibold text-gray-500">
            Enter your informations below to create your account
          </h4>
          <div className="">
            <p className="text-red-500 text-sm font-medium pb-2">
              {signUpError}
            </p>
            <SignUpForm setStatus={setStatus} setSignUpError={setSignUpError} />
          </div>
        </>
      )}
    </div>
  );
}
