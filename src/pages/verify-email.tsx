export default function VerifyEmail() {
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-around items-center">
      <h1 className="text-xl">
        Verify your email
      </h1>

      <p className="text-md">
        A verification email has been sent to you, please verify your email address.
        Once you have done so, please log in using the button below.
      </p>

      <button className="bg-red-400 rounded-full p-2 m-4">
        Login
      </button>
    </div>
  );
}