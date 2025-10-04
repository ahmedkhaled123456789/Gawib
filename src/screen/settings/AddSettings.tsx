import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { addSetting } from "../../store/settingSlice";
import { toast } from "sonner";

interface AddSettingsProps {
  onClose: () => void;
}

const AddSettings: React.FC<AddSettingsProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("STRING");

  const handleAdd = () => {
    if (!key || !value || !type) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    dispatch(addSetting({ key, value, type }));
    setKey("");
    setValue("");
    setType("STRING");
    onClose();
  };

  return (
    <div className="w-[70%] p-5 mb-4">
      <div className="bg-white rounded-md p-5 mb-5 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-5">
          إضافة إعداد جديد
        </h2>

        <form className="flex flex-wrap items-center justify-between gap-5">
          {/* إدخال Key */}
          <div className="flex flex-col mb-4 w-[48%]">
            <label className="mb-1 text-lg text-center">المفتاح (Key)</label>
            <input
              type="text"
              placeholder="ادخل المفتاح"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full rounded border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
            />
          </div>

          {/* إدخال القيمة */}
          <div className="flex flex-col mb-4 w-[48%]">
            <label className="mb-1 text-lg text-center">القيمة (Value)</label>
            <input
              type="text"
              placeholder="ادخل القيمة"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
            />
          </div>

          {/* اختيار النوع */}
          <div className="flex flex-col mb-4 w-[48%]">
            <label className="mb-1 text-lg text-center">النوع (Type)</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
            >
              <option value="STRING">STRING</option>
              <option value="EMAIL">EMAIL</option>
              <option value="NUMBER">NUMBER</option>
            </select>
          </div>
        </form>

        {/* الرسائل في الأسفل */}
        <p className="text-center text-sm text-gray-500 mt-3">
          تأكد من إدخال القيم الصحيحة قبل الإضافة.
        </p>

        {/* الأزرار */}
        <div className="w-full mt-5 flex justify-between gap-4">
          <button
            type="button"
            onClick={handleAdd}
            className="w-[45%] px-7 py-2 bg-[#085E9C] text-white rounded-md"
          >
            إضافة
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-[45%] px-7 py-2 border border-[#085E9C] text-[#085E9C] rounded-md"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSettings;
