import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  getSettings,
  updateSetting,
  deleteSetting,
} from "../../store/settingSlice";
import CustomModal from "../../components/Modals/CustomModal";
import AddSettings from "./AddSettings";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";

const ArabicFormLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { settings } = useSelector((state: RootState) => state.settings);

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  useEffect(() => {
    const mapped: Record<string, string> = {};
    settings?.data?.forEach((item) => {
      mapped[item.key] = item.value;
    });
    setFormData(mapped);
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    console.log("Changing", key, value);
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (key: string) => {
    const setting = settings?.data?.find((s) => s.key === key);
    console.log("Saving key:", key, "Setting found:", setting);

    if (!setting) {
      toast.error("المفتاح غير موجود: " + key);
      return;
    }

    console.log("Data to save:", { ...setting, value: formData[key] });

    dispatch(
      updateSetting({
        id: Number(setting.id),
        data: { ...setting, value: formData[key] },
      })
    )
      .unwrap()
      .then(() => toast.success("تم الحفظ بنجاح"))
      .catch(() => toast.error("حدث خطأ أثناء الحفظ"));
  };

  const handleDelete = (key: string) => {
    const setting = settings?.data?.find((s) => s.key === key);
    if (!setting) return;

    toast("هل تريد الحذف؟", {
      action: {
        label: "نعم",
        onClick: () => {
          dispatch(deleteSetting(setting.id!))
            .unwrap()
            .then(() => {
              toast.success("تم الحذف بنجاح");
              dispatch(getSettings());
            })
            .catch(() => toast.error("حدث خطأ أثناء الحذف"));
        },
      },
    });
  };

  return (
    <div dir="rtl" className="p-4">
      <h1 className="text-lg font-bold mb-4 text-[#085E9C]">الإعدادات</h1>

      {/* زر إضافة إعداد جديد */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          إضافة إعداد جديد
        </button>
      </div>

      <CustomModal isOpen={showAddModal}>
        <AddSettings onClose={() => setShowAddModal(false)} />
      </CustomModal>

      {/* الرسائل والبريد الإلكتروني */}
      <div className="bg-white shadow-sm border border-[#085E9C] mb-6">
        <div className="flex items-center justify-between border-b border-[#085E9C] p-4 text-[#085E9C]">
          <h2 className="text-lg font-medium">الرسائل والبريد الإلكتروني</h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                handleSave("buy_message");
                handleSave("gift_message");
              }}
              className="bg-[#085E9C] text-white px-6 py-2 text-sm font-bold rounded"
            >
              حفظ
            </button>
            <button
              onClick={() => handleDelete("buy_message")}
              className="bg-red-500 text-white px-4 py-2 text-sm font-bold rounded flex items-center gap-1"
            >
              <TrashIcon size={16} />
              حذف
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <button className="bg-yellow-500 w-[28%] border border-yellow-500 hover:bg-yellow-600 text-[#085E9C] px-6 py-3 rounded text-sm font-medium">
              ادفع الآن ( الشراء )
            </button>
            <input
              type="email"
              placeholder="شكرا لشراء 3 أعضاء بمبلغ 150 ريال، استخدم بريدك"
              value={formData["buy_message"] || ""}
              onChange={(e) => handleChange("buy_message", e.target.value)}
              className="flex-1 px-4 py-3 border border-[#085E9C] rounded text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="bg-yellow-500 w-[28%] border border-yellow-500 hover:bg-yellow-600 text-[#085E9C] px-6 py-3 rounded text-sm font-medium">
              ادفع الآن ( الصفحة )
            </button>
            <input
              type="email"
              placeholder="مبروك العضوية، حصلت على رصيد واحد، استخدم بريدك"
              value={formData["gift_message"] || ""}
              onChange={(e) => handleChange("gift_message", e.target.value)}
              className="flex-1 px-4 py-3 border border-[#085E9C] rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* عن Jawab */}
      <div className="bg-white rounded shadow-sm border border-[#085E9C] mb-6">
        <div className="flex items-center justify-between border-b border-[#085E9C] p-4 text-[#085E9C]">
          <h2 className="text-lg font-medium">عن جواب</h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleSave("about_us")}
              className="bg-[#085E9C] text-white px-6 py-2 text-sm font-bold rounded"
            >
              حفظ
            </button>
            <button
              onClick={() => handleDelete("about_us")}
              className="bg-red-500 text-white px-4 py-2 text-sm font-bold rounded flex items-center gap-1"
            >
              <TrashIcon size={16} />
              حذف
            </button>
          </div>
        </div>
        <div className="p-6">
          <textarea
            className="w-full h-32 px-4 py-3 border border-[#085E9C] rounded text-sm"
            placeholder="اكتب وصف حول المنصة..."
            value={formData["about_us"] || ""}
            onChange={(e) => handleChange("about_us", e.target.value)}
          />
        </div>
      </div>

      {/* شروط الاستخدام */}
      <div className="bg-white rounded shadow-sm border border-[#085E9C] mb-6">
        <div className="flex items-center justify-between border-b border-[#085E9C] p-4 text-[#085E9C]">
          <h2 className="text-lg font-medium">شروط الاستخدام</h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleSave("terms_and_conditions")}
              className="bg-[#085E9C] text-white px-6 py-2 text-sm font-bold rounded"
            >
              حفظ
            </button>
            <button
              onClick={() => handleDelete("terms_and_conditions")}
              className="bg-red-500 text-white px-4 py-2 text-sm font-bold rounded flex items-center gap-1"
            >
              <TrashIcon size={16} />
              حذف
            </button>
          </div>
        </div>
        <div className="p-6">
          <textarea
            className="w-full h-32 px-4 py-3 border border-[#085E9C] rounded text-sm"
            placeholder="اكتب شروط الاستخدام..."
            value={formData["terms_and_conditions"] || ""}
            onChange={(e) =>
              handleChange("terms_and_conditions", e.target.value)
            }
          />
        </div>
      </div>

      {/* ضريبة القيمة المضافة */}
      <div className="bg-white rounded shadow-sm border border-[#085E9C] mb-6">
        <div className="flex items-center justify-between border-b border-[#085E9C] p-4 text-[#085E9C]">
          <h2 className="text-lg font-medium">ضريبة القيمة المضافة</h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleSave("app_stamp_tax")}
              className="bg-[#085E9C] text-white px-6 py-2 text-sm font-bold rounded"
            >
              حفظ
            </button>
            <button
              onClick={() => handleDelete("app_stamp_tax")}
              className="bg-red-500 text-white px-4 py-2 text-sm font-bold rounded flex items-center gap-1"
            >
              <TrashIcon size={16} />
              حذف
            </button>
          </div>
        </div>
        <div className="p-6 flex items-center gap-4">
          <button className="bg-yellow-500 border w-[28%] border-yellow-500 hover:bg-yellow-600 text-[#085E9C] px-6 py-3 rounded text-sm font-medium">
            ضريبة القيمة المضافة
          </button>
          <input
            type="text"
            placeholder="% 15"
            value={formData["app_stamp_tax"] || ""}
            onChange={(e) => handleChange("app_stamp_tax", e.target.value)}
            className="flex-1 px-4 py-3 border border-[#085E9C] rounded text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ArabicFormLayout;
