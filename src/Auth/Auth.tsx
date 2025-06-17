import LoginHook from "../hook/auth/login-hook";

const Auth = () => {
  const { onSubmit, loading } = LoginHook();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="wrapper h-screen w-full flex justify-center items-center bg-gray-100">
      <div className="mx-auto max-w-xl px-6 lg:px-10">
        <div className="mx-auto w-[400px] ">
          <form
            className="mb-0 mt-6 bg-[#257180] text-white space-y-6 rounded-lg p-8 shadow-xl"
            onSubmit={handleSubmit}
          >
            <p className="text-center text-3xl font-semibold">تسجيل الدخول</p>

            <div>
              <label htmlFor="email" className="block mb-1 text-lg">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full outline-none text-black rounded-lg border border-gray-300 p-3 text-lg"
                placeholder="أدخل البريد الإلكتروني"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-lg">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full outline-none text-black rounded-lg border border-gray-300 p-3 text-lg"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            <p className="text-start underline cursor-pointer text-sm">
              هل نسيت كلمة المرور؟
            </p>

            <button
              type="submit"
              className="block w-full cursor-pointer rounded-lg bg-white px-6 py-3 text-lg font-medium text-[#257180] transition hover:bg-gray-200"
              disabled={loading}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
