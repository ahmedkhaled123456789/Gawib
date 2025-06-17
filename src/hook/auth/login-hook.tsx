import { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { adminLogin } from "../../Redux/slice/AuthSlice";
import { AppDispatch } from "../../Redux/store";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom"; // Use navigate for routing

const LoginHook = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // State variables with types
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const { email, password } = Array.from(
      new FormData(target).entries()
    ).reduce((acc, c) => ({ ...acc, [c[0]]: c[1] }), {}) as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      toast.warn(`${t("Please-complete")}`);
      return;
    }

    setLoading(true);

    try {
      const result = await dispatch(adminLogin({ email, password })).unwrap();
      if (result.token) {
        toast.success(`${t("Login-successful!")}`);
        navigate("/");
      } else {
        toast.error(`${t("Login-failed")}`);
      }
    } catch (_error: any) {
      toast.error(`${t("error-occurred")}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    onSubmit,
  };
};

export default LoginHook;
