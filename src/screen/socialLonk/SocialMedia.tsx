import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import {
  getSocialLinks,
  updateSocialLink,
  deleteSocialLink,
} from "../../store/SocialLinksSlice";
import { toast } from "sonner";
import { EditIcon, TrashIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

const SocialMedia = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { socialLinks } = useSelector((state: RootState) => state.socialLinks);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getSocialLinks());
  }, [dispatch]);

  const handleConfirmStatus = async (data: {
    id: number;
    is_active: "0" | "1";
  }) => {
    setLoadingId(data.id);
    try {
      await dispatch(
        updateSocialLink({
          id: data.id,
          data: { is_active: data.is_active, _method: "PUT" },
        })
      ).unwrap();
      toast.success("تم تحديث الحالة بنجاح ✅");
    } catch {
      toast.error("حدث خطأ أثناء تحديث الحالة ❌");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = (id: number) => {
    toast("هل تريد حذف هذا الرابط؟", {
      action: {
        label: "نعم",
        onClick: async () => {
          setLoadingId(id);
          try {
            await dispatch(deleteSocialLink(id)).unwrap();
            toast.success("تم حذف الرابط بنجاح ✅");
          } catch {
            toast.error("حدث خطأ أثناء الحذف ❌");
          } finally {
            setLoadingId(null);
          }
        },
      },
      duration: 4000,
    });
  };

  const updateUrl = (id: number, url: string) => {
    console.log(`تحديث الرابط للمنصة ${id}:`, url);
  };

  const handleSave = () => {
    const selected = socialLinks.filter((item) => item.is_active && item.url);
    toast.success(
      `تم حفظ ${selected.length} من منصات التواصل الاجتماعي بنجاح!`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 mb-4 border-b border-[#085E9C] py-3 text-[#085E9C] text-lg font-bold">
        <p className="text-md ml-16 font-bold">التواصل الاجتماعي</p>
        {/* زر الإضافة */}
        <Link
          to="/add-socialMedia"
          className="flex items-center gap-2 bg-[#085E9C] hover:bg-[#0a6bb9] text-white px-4 py-2 rounded transition-colors"
        >
          <PlusIcon size={18} />
          إضافة
        </Link>
      </div>

      <div className="m-6 rounded border border-[#085E9C] overflow-hidden">
        {/* Header */}
        <div className="bg-white text-gray-800 border-b border-[#085E9C]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-[#085E9C] font-bold">
              التواصل الاجتماعي
            </h2>
            <button
              onClick={handleSave}
              className="bg-[#085E9C] text-white px-5 py-4 font-medium transition-colors"
            >
              حفظ
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-1">
            {socialLinks && socialLinks.length > 0 ? (
              socialLinks.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center py-3 px-2 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded"
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center p-2 border border-[#085E9C] border-l-0">
                    <img
                      src={item.icon || "/images/default-social.png"}
                      alt={item.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  </div>

                  {/* URL Input */}
                  <input
                    type="text"
                    value={item.url || ""}
                    onChange={(e) => updateUrl(item.id, e.target.value)}
                    className="flex-1 px-4 py-3 border border-[#085E9C] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    dir="ltr"
                  />

                  <div className="flex items-center gap-x-2">
                    {/* Toggle Button */}
                    <button
                      onClick={() =>
                        handleConfirmStatus({
                          id: item.id,
                          is_active: item.is_active ? "0" : "1",
                        })
                      }
                      disabled={loadingId === item.id}
                      className={`w-12 h-12 mr-2 border border-[#085E9C] flex items-center justify-center transition-all ${
                        item.is_active ? "bg-green-50" : "bg-white"
                      }`}
                    >
                      {loadingId === item.id ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#085E9C]"></div>
                      ) : item.is_active ? (
                        <img
                          src="/images/group/true.png"
                          alt="selected"
                          className="w-6 h-6"
                        />
                      ) : null}
                    </button>
                    {/* ✏️ Edit Button */}
                    <Link
                      to={`edit/${item.id}`}
                      className="text-blue-900 hover:text-blue-700"
                    >
                      <EditIcon size={20} />
                    </Link>
                    {/* 🗑️ Delete Button */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      <TrashIcon size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">
                لا توجد بيانات تواصل اجتماعي متاحة حالياً.
              </p>
            )}
          </div>

          {/* Summary */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 text-center">
                تم تحديد {socialLinks.filter((p) => p.is_active).length} من أصل{" "}
                {socialLinks.length} منصة
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
