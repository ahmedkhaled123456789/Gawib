import { Link } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";

interface LoginFormProps {
  loginMethod: "email" | "phone";
  setLoginMethod: (method: "email" | "phone") => void;
  form: {
    first_name?: string;
    last_name?: string;
    email: string;
    phone_number: string;
    password: string;
    password_confirmation?: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: () => void;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loginMethod,
  setLoginMethod,
  form,
  setForm,
  handleChange,
  handleLogin,
  loading,
}) => {
  return (
    <>
      {/* Toggle Buttons */}
      <div className="flex justify-center mb-4">
        <div className="grid grid-cols-2 p-1 w-full max-w-xs border border-gray-300 rounded overflow-hidden">
          <button
            onClick={() => setLoginMethod("phone")}
            className={`px-4 py-2 text-sm transition ${
              loginMethod === "phone"
                ? "bg-[#FFC629] font-bold text-[#085E9C]"
                : "text-gray-700"
            }`}
          >
            رقم الجوال
          </button>
          <button
            onClick={() => setLoginMethod("email")}
            className={`px-4 py-2 text-sm transition ${
              loginMethod === "email"
                ? "bg-[#FFC629] font-bold text-[#085E9C]"
                : "text-gray-700"
            }`}
          >
            البريد الإلكتروني
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4 w-full max-w-md mx-auto">
        {loginMethod === "phone" && (
          <PhoneInput
            country={"sa"}
            enableSearch
            value={form.phone_number?.replace("+", "") || ""}
            onChange={(value: string) =>
              setForm((prev: any) => ({
                ...prev,
                phone_number: `+${value}`,
              }))
            }
            inputProps={{
              name: "phone_number",
              className: "border-red-500",
              dir: "ltr",
            }}
            containerStyle={{
              width: "100%",
              direction: "ltr",
            }}
            inputStyle={{
              width: "100%",
              textAlign: "left",
              borderRadius: "6px",
              paddingLeft: "48px",
              paddingRight: "10px",
              height: "42px",
              border: "1px solid #d1d5db",
              boxShadow: "none",
            }}
            buttonStyle={{
              backgroundColor: "transparent",
              border: "none",
              left: "0",
            }}
          />
        )}

        {loginMethod === "email" && (
          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            className="border focus:outline-none px-3 py-2 rounded w-full text-right"
            value={form.email}
            onChange={handleChange}
          />
        )}

        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          className="border px-3 py-2 focus:outline-none rounded w-full text-right"
          value={form.password}
          onChange={handleChange}
        />

        {/* Login Button + Forget Password */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full sm:w-1/2 font-bold border border-[#085E9C] text-[#085E9C] py-2 rounded hover:bg-[#085E9C] hover:text-white transition disabled:opacity-50"
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>

          <Link
            to="/forgetPassword"
            className="text-sm text-gray-500 text-center sm:text-right hover:underline"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
