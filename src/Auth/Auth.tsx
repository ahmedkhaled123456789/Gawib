import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { loginUser } from "../store/auth/authSlice";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";

const Auth: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
 const user =localStorage.getItem("user");

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

  const handleLogin = () => {
    const payload =
      loginMethod === "email"
        ? { email: form.email, password: form.password }
        : { phone: form.phone_number, password: form.password };

    dispatch(loginUser(payload));
  };
useEffect(() => {
  if (user) {
    navigate("/");
  }
}, [user]);
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
