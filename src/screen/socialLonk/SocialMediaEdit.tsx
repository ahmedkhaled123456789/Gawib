import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import {
  getSocialLinkById,
  updateSocialLink,
} from "../../store/SocialLinksSlice";
import { toast } from "sonner";

const SocialMediaEdit = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { socialLink, loading } = useSelector(
    (state: RootState) => state.socialLinks
  );

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(getSocialLinkById(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (socialLink) {
      setName(socialLink.name || "");
      setUrl(socialLink.url || "");
      setIsActive(Boolean(socialLink.is_active));
      setIconPreview(socialLink.icon || null);
    }
  }, [socialLink]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIconFile(e.target.files[0]);
      setIconPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    // Validation
    if (!url.trim()) {
      toast.error("حقل رابط المنصة مطلوب.");
      return;
    }

    try {
      new URL(url);
    } catch (error) {
      toast.error("حقل رابط المنصة يجب أن يكون عنوان URL صحيح.");
      return;
    }

    if (!iconFile && !iconPreview) {
      toast.error("يجب رفع صورة للأيقونة.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("url", url);
    formData.append("is_active", isActive ? "1" : "0");
    formData.append("_method", "put");

    if (iconFile) {
      formData.append("icon", iconFile);
    }

    const result = await dispatch(
      updateSocialLink({
        id: Number(id),
        data: formData as any,
      })
    );

    if ("payload" in result && (result.payload as any)?.success) {
      toast.success("تم التعديل بنجاح ✅");
      navigate("/socialMedia");
    } else {
      toast.error("حدث خطأ أثناء التعديل، يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8"
      dir="rtl"
    >
      <div className="max-w-2xl mx-auto">
        {/* زر العودة */}
        <button
          onClick={() => navigate("/socialMedia")}
          className="mb-4 flex items-center gap-2 text-[#085E9C] font-bold text-lg hover:underline"
        >
          ← العودة
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            تعديل رابط التواصل الاجتماعي
          </h1>
          <p className="text-gray-600">
            قم بتعديل معلومات رابط التواصل الاجتماعي الخاص بك
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#085E9C]"></div>
            </div>
          )}

          {!loading && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name and URL Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    اسم المنصة
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#085E9C] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="أدخل اسم المنصة"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    رابط المنصة
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#085E9C] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <h3 className="font-semibold text-gray-800">حالة الرابط</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {isActive
                      ? "الرابط نشط ومتاح للجميع"
                      : "الرابط غير نشط ومخفي"}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="ml-12 text-md font-bold text-gray-700">
                    {isActive ? "نشط" : "غير نشط"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 ${
                      isActive ? "bg-[#085E9C]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Icon Upload */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    أيقونة المنصة
                  </label>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    {/* Icon Preview */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        {iconPreview ? (
                          <img
                            src={iconPreview}
                            alt="Icon Preview"
                            className="w-24 h-24 object-contain rounded-2xl border-2 border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                            <span className="text-gray-500 text-sm">
                              لا توجد صورة
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload Button */}
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-3">
                        اختر صورة الأيقونة من جهازك. يفضل أن تكون بصيغة PNG أو
                        SVG بخلفية شفافة.
                      </p>
                      <label className="inline-flex items-center gap-2 bg-white text-[#085E9C] border-2 border-[#085E9C] hover:bg-[#085E9C] hover:text-white font-medium px-6 py-3 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                        {iconPreview ? "تغيير الأيقونة" : "رفع أيقونة جديدة"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleIconChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/social-links")}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#085E9C] text-white font-medium rounded-xl hover:bg-[#064870] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  حفظ التعديلات
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaEdit;
