import SignUpForm from "./SignupForm";

export default function SingUp() {
  return (
    <div className="w-full flex flex-col justify-center px-8 lg:mx-auto">
      <h2 className="text-3xl font-bold text-gray-800">Create an account</h2>
      <h4 className="text-sm font-semibold text-gray-500">
        Enter your informations below to create your account
      </h4>
      <div className="mt-3">
        <SignUpForm />
      </div>
    </div>
  );
}
