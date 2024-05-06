import SingUpForm from "./SignupForm";

export default function SingUp() {
  return (
    <div className="w-[1000px] h-[650px] rounded-2xl bg-white flex">
      <img
        className="w-[45%] h-full object-cover rounded-l-2xl"
        src={"/signup_background.jpg"}
        alt="background_img"
      />
      <div className="mx-auto flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-gray-800">Create an account</h2>
        <h4 className="text-sm font-semibold text-gray-500">
          Enter your email below to create your account
        </h4>
        <div className="mt-3">
          <SingUpForm />
        </div>
      </div>
    </div>
  );
}
