import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { createSocialLink } from "../../store/SocialLinksSlice";
import { toast } from "sonner";

const AddSocialMedia = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state: RootState) => state.socialLinks
  );

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!iconFile) {
      toast.error("يرجى اختيار أيقونة للرابط");
      return;
    }

    if (!name || !url) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const result = await dispatch(
      createSocialLink({
        name,
        url,
        is_active: isActive,
        icon: iconFile,
      })
    );

    if (createSocialLink.fulfilled.match(result)) {
      toast.success("تم إنشاء الرابط بنجاح ✅");
      navigate("/socialMedia");
    } else {
      toast.error(result.payload || "فشل إنشاء الرابط ❌");
    }
  };

  const removeIcon = () => {
    setIconFile(null);
    setIconPreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            إضافة رابط تواصل اجتماعي جديد
          </h1>
          <p className="text-gray-600">
            أضف منصة تواصل اجتماعي جديدة إلى موقعك
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name and URL Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  اسم المنصة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#085E9C] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="مثال: فيسبوك"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  الرابط <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#085E9C] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="https://facebook.com/username"
                  required
                />
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">حالة الرابط</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {isActive ? "الرابط نشط ومتاح للجميع" : "الرابط غير نشط ومخفي"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-base font-medium text-gray-700 min-w-[60px] text-left">
                  {isActive ? "نشط" : "غير نشط"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ${
                    isActive ? 'bg-[#085E9C]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                      isActive ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Icon Upload */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  أيقونة المنصة <span className="text-red-500">*</span>
                </label>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  {/* Icon Preview */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      {iconPreview ? (
                        <div className="relative">
                          <img
                            src={iconPreview}
                            alt="Icon Preview"
                            className="w-24 h-24 object-contain rounded-2xl border-2 border-gray-200 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={removeIcon}
                            className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                          <span className="text-gray-500 text-sm text-center px-2">لا توجد صورة</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Button */}
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-3">
                      اختر صورة الأيقونة من جهازك. يفضل أن تكون بصيغة PNG أو SVG بخلفية شفافة.
                    </p>
                    <label className="inline-flex items-center gap-2 bg-white text-[#085E9C] border-2 border-[#085E9C] hover:bg-[#085E9C] hover:text-white font-medium px-6 py-3 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {iconPreview ? "تغيير الأيقونة" : "رفع أيقونة جديدة"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleIconChange}
                        required={!iconPreview}
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
                onClick={() => navigate("/socialMedia")}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
                disabled={loading}
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#085E9C] text-white font-medium rounded-xl hover:bg-[#064870] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    إنشاء الرابط
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSocialMedia;