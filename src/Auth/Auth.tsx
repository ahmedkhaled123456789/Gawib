import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { loginUser } from "../store/auth/authSlice";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    try {
      if (loginMethod === "email") {
        if (!form.email || !form.password) {
          toast.error("من فضلك أدخل البريد الإلكتروني وكلمة المرور");
          return;
        }
      } else {
        if (!form.phone_number || !form.password) {
          toast.error("من فضلك أدخل رقم الجوال وكلمة المرور");
          return;
        }
      }

      const payload =
        loginMethod === "email"
          ? { email: form.email, password: form.password }
          : { phone: form.phone_number, password: form.password };

      await dispatch(loginUser(payload)).unwrap();

      toast.success("تم تسجيل الدخول بنجاح ✨");
    } catch (err: any) {
      toast.error(err || "الإيميل أو رقم الجوال أو كلمة المرور غير صحيحة");
    }
  };

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token]);
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h2 className="text-xl text-center font-bold mb-6 text-[#085E9C]">
          تسجيل الدخول
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <LoginForm
          loginMethod={loginMethod}
          setLoginMethod={setLoginMethod}
          form={form}
          setForm={setForm}
          handleChange={handleChange}
          handleLogin={handleLogin}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Auth;
