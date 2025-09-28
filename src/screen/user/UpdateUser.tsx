import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../../store";
import { updateUser, getUserById } from "../../store/userSlice";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Loader from "../../components/Loader";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    nationality: "",
    password: "",
    remaining_games: "",
    status: 1,
  });

  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      setLoadingUser(true);
      dispatch(getUserById(id))
        .unwrap()
        .then((user: any) => {
          setFormData({
            ...user,
            status: user.status ? 1 : 0,
          });
        })
        .catch((err: any) => {
          toast.error(err || "فشل تحميل بيانات المستخدم");
        })
        .finally(() => setLoadingUser(false));
    }
  }, [id, dispatch]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : type === "number"
          ? +value
          : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!id) return;

    const requiredFields = [
      { key: "first_name", label: "الاسم الأول" },
      { key: "last_name", label: "الاسم الأخير" },
      { key: "email", label: "البريد الإلكتروني" },
      { key: "phone_number", label: "رقم الهاتف" },
    ];

    const emptyFields = requiredFields.filter(
      (field) => !formData[field.key]?.toString().trim()
    );

    if (emptyFields.length > 0) {
      toast.error(`من فضلك ادخل ${emptyFields.map((f) => f.label).join("، ")}`);
      return;
    }

    try {
      setSubmitting(true);
      const res = await dispatch(updateUser({ id, ...formData })).unwrap();
      toast.success(res?.message || "تم تحديث بيانات المستخدم بنجاح");
      navigate("/");
    } catch (err: any) {
      toast.error(err || "فشل التحديث");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <Loader />
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg ">
      <h2 className="text-2xl font-bold text-[#085E9C] mb-6">تعديل المستخدم</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* الاسم الأول */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            الاسم الأول
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            disabled={submitting}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#085E9C] focus:border-[#085E9C]"
          />
        </div>

        {/* الاسم الأخير */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            الاسم الأخير
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            disabled={submitting}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#085E9C] focus:border-[#085E9C]"
          />
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={submitting}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#085E9C] focus:border-[#085E9C]"
          />
        </div>

        {/* رقم الهاتف بـ PhoneInput */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            رقم الهاتف
          </label>
          <PhoneInput
            country={"eg"}
            value={formData.phone_number}
            enableSearch
            onChange={(phone) =>
              setFormData((prev: any) => ({
                ...prev,
                phone_number: `+${phone}`,
              }))
            }
            inputClass="!w-full !px-3 !py-2 !border !rounded-md !shadow-sm focus:!ring-2 focus:!ring-[#085E9C] focus:!border-[#085E9C]"
            inputProps={{
              name: "phone_number",
              dir: "rtl",
              disabled: submitting,
            }}
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
        </div>

        {/* الجنسية */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            الجنسية
          </label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            disabled={submitting}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#085E9C] focus:border-[#085E9C]"
          />
        </div>

        {/* كلمة المرور */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            كلمة المرور
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={submitting}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#085E9C] focus:border-[#085E9C]"
          />
        </div>

        {/* الألعاب المتبقية */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            الألعاب المتبقية
          </label>
          <input
            type="number"
            name="remaining_games"
            value={formData.remaining_games}
            onChange={handleChange}
            disabled={submitting}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#085E9C] focus:border-[#085E9C]"
          />
        </div>

        {/* الحالة */}
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="status"
            checked={formData.status === 1}
            onChange={handleChange}
            disabled={submitting}
            className="w-4 h-4 text-[#085E9C] border-gray-300 rounded focus:ring-[#085E9C]"
          />
          <label className="text-gray-700">الحساب نشط</label>
        </div>

        {/* أزرار */}
        <div className="col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            disabled={submitting}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition disabled:opacity-50"
          >
            العوده
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-[#085E9C] text-white rounded-md hover:bg-[#064a7c] transition flex items-center gap-2 disabled:opacity-70"
          >
            {submitting && <Loader2 className="animate-spin h-4 w-4" />}
            حفظ التعديلات
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUser;
