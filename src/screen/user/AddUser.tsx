import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { createUser } from "../../store/UserActionsSlic";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AddUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [countryName, setCountryName] = useState("EGYPT"); // 🇪🇬 القيمة الافتراضية

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    let rawPhone = phone.replace(/\s/g, "");
    if (!rawPhone.startsWith("+")) rawPhone = `+${rawPhone}`;

    const userData = {
      first_name: (formData.get("first_name") as string)?.trim() || "",
      last_name: (formData.get("last_name") as string)?.trim() || "",
      email: (formData.get("email") as string)?.trim() || "",
      phone_number: rawPhone,
      password: (formData.get("password") as string) || "",
      played_games: Number(formData.get("played_games") || 0),
      status: formData.get("status") === "on" ? 1 : 0,
      is_supervisor: formData.get("is_supervisor") === "on" ? 1 : 0,
      nationality: countryName.toUpperCase(), // ✅ إضافة الجنسية بناءً على رقم الموبايل
    };

    if (
      !userData.first_name ||
      !userData.last_name ||
      !userData.email ||
      !userData.phone_number ||
      !userData.password
    ) {
      toast.error("جميع الحقول مطلوبة");
      setLoading(false);
      return;
    }

    if (userData.password.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      setLoading(false);
      return;
    }

    const phoneDigits = userData.phone_number.replace(/\D/g, "");
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      toast.error("رقم الهاتف يجب أن يكون بين 7 و15 رقمًا");
      setLoading(false);
      return;
    }

    try {
      await dispatch(createUser(userData)).unwrap();
      if (e.currentTarget) e.currentTarget.reset();
      setPhone("");
      toast.success("تم إضافة المستخدم بنجاح");
      navigate("/");
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        typeof err === "string" ? err : err?.message ?? "حدث خطأ أثناء الإضافة";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ نحدث الدولة لما المستخدم يغير رقم الموبايل
  const handlePhoneChange = (value: string, data: any) => {
    setPhone(value);
    setCountryName(data?.name || "UNKNOWN");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-6 relative">
      {/* زر العودة للخلف */}
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center gap-1 text-[#085E9C] hover:text-[#064a7c] font-bold"
      >
        <ArrowLeft size={18} /> العودة
      </Link>

      <h2 className="text-2xl font-bold mb-6 text-center text-[#085E9C]">
        إضافة مستخدم جديد
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="first_name"
          placeholder="الاسم الأول"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#085E9C]"
        />
        <input
          type="text"
          name="last_name"
          placeholder="الاسم الأخير"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#085E9C]"
        />
        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#085E9C]"
        />

        {/* ✅ تعديل PhoneInput لقراءة اسم الدولة */}
        <PhoneInput
          country={"eg"}
          value={phone}
          onChange={handlePhoneChange}
          inputClass="w-full"
          enableSearch
          containerClass="w-full"
          containerStyle={{ direction: "rtl" }}
          inputStyle={{
            width: "100%",
            textAlign: "right",
            borderRadius: "6px",
            paddingRight: "50px",
            padding: "20px 10px",
          }}
          buttonStyle={{
            backgroundColor: "transparent",
            border: "none",
            position: "absolute",
            left: "0",
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#085E9C]"
        />
        <input
          type="number"
          name="played_games"
          placeholder="عدد الألعاب"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#085E9C]"
        />

        {/* ✅ Checkboxes للحالة والمشرف */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" name="status" className="h-4 w-4" defaultChecked />
            <label>نشط</label>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="is_supervisor" className="h-4 w-4" />
            <label>مستخدم يضيف لعبة</label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#085E9C] flex items-center justify-center text-white rounded hover:bg-[#064a7c] transition"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5 text-center" />
          ) : (
            "إضافة مستخدم"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddUser;
