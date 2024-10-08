import SignInForm from "./SignInForm";

export default function SignIn() {
  return (
    <div className="w-full flex flex-col justify-center px-8 lg:mx-auto">
      <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
      <h4 className="text-sm font-semibold text-gray-500">
        Sign In to your account
      </h4>
      <div className="mt-3">
        <SignInForm />
      </div>
    </div>
  );
}
