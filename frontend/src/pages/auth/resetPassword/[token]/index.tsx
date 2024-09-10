import UpdatePasswordForm from "./UpdatePasswordForm";

export default function UpdatePassword() {
  return (
    <div className="w-full flex flex-col justify-center px-8 lg:mx-auto">
      <h2 className="text-3xl font-bold text-gray-800">Reset your password!</h2>
      <h4 className="text-sm font-semibold text-gray-500">
        Update your password
      </h4>
      <div className="mt-3">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
