import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../../store";
import { updateAdmin, getAdminById } from "../../store/adminSlice";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Loader from "../../components/Loader";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const UpdateAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    is_super_admin: 0,
    is_active: true,
  });

  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // تحميل بيانات الأدمن
  useEffect(() => {
    if (id) {
      setLoadingAdmin(true);
      dispatch(getAdminById(id))
        .unwrap()
        .then((res: any) => {
          const admin = res.data; // البيانات من الـ API
          setFormData({
            name: admin.name || "",
            email: admin.email || "",
            phone_number: admin.phone_number || "",
            password: "",
            is_super_admin: admin.is_super_admin ? 1 : 0,
            is_active: admin.is_active ? true : false,
          });
        })
        .catch((err: any) => {
          toast.error(err || "فشل تحميل بيانات الأدمن");
        })
        .finally(() => setLoadingAdmin(false));
    }
  }, [id, dispatch]);

  // التغيير في الفورم
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]:
        name === "is_super_admin"
          ? Number(value)
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  // تحديث البيانات
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!id) return;

    if (!formData.name || !formData.email || !formData.phone_number) {
      toast.error("من فضلك املأ جميع الحقول المطلوبة");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        id,
        data: {
          name: formData.name,
          email: formData.email,
          phone_number: formData.phone_number,
          password: formData.password || undefined, // لو فاضي مش يتبعت
          is_super_admin: formData.is_super_admin,
          is_active: formData.is_active,
        },
      };
      const res = await dispatch(updateAdmin(payload)).unwrap();
      toast.success(res?.message || "تم تحديث بيانات الأدمن بنجاح");
      navigate("/admins");
    } catch (err: any) {
      toast.error(err || "فشل التحديث");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingAdmin) {
    return <Loader />;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-[#085E9C] mb-6">تعديل الأدمن</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* الاسم */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            الاسم
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
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

        {/* رقم الهاتف */}
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
                phone_number: "+" + phone,
              }))
            }
            inputClass="!w-full !px-3 !py-2 !border !rounded-md !shadow-sm focus:!ring-2 focus:!ring-[#085E9C] focus:!border-[#085E9C]"
            inputProps={{
              name: "phone_number",
              dir: "rtl",
              disabled: submitting,
              required: true,
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
            placeholder="اتركها فارغة إذا لم ترد تغييرها"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#085E9C] focus:border-[#085E9C]"
          />
        </div>

        {/* نوع الأدمن */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            نوع الأدمن
          </label>
          <select
            name="is_super_admin"
            value={formData.is_super_admin}
            onChange={handleChange}
            disabled={submitting}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#085E9C] focus:border-[#085E9C]"
          >
            <option value={0}>عادي</option>
            <option value={1}>سوبر أدمن</option>
          </select>
        </div>

        {/* الحالة */}
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
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
            onClick={() => navigate("/admins")}
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

export default UpdateAdmin;
