import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

interface InputFieldProps {
  label: string;
  placeholder: string;
  set: React.Dispatch<React.SetStateAction<string>>;
  val: string;
  type: string;
}

const InputField = ({
  label,
  placeholder,
  set,
  val,
  type,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col mb-4 w-[48%]">
      <label className="mb-1 text-lg text-center">{label}</label>
      <input
        value={val}
        onChange={(e) => set(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="w-full rounded border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
      />
    </div>
  );
};

const Refund = ({
  onClose,
  paymentId,
}: {
  onClose: () => void;
  paymentId: number;
}) => {
  const [name, setName] = useState("");
  const [gamesCount, setGamesCount] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState("1");

  const submitData = async () => {
    if (!name || !gamesCount || !price) {
      toast.error("يرجى استكمال جميع الحقول!");
      return;
    }

    const refundData = {
      name,
      games_count: Number(gamesCount),
      price: Number(price),
      is_active: Number(isActive),
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/payments/refund/${paymentId}`,
        refundData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // لو محتاج توكن
          },
        }
      );

      console.log("Refund Response:", res.data);
      toast.success("تم استرداد المبلغ بنجاح!");
      onClose();
    } catch (error: any) {
      console.error("Refund Error:", error);
      toast.error(error.response?.data?.message || "فشل في عملية الاسترداد!");
    }
  };

  return (
    <div className="w-[70%] p-5 mb-4">
      <div className="bg-white rounded-md p-5 mb-5">
        <form className="flex flex-wrap items-center justify-between gap-5 pt-5">
          <InputField
            val={name}
            set={setName}
            type="text"
            label="اسم الباقة"
            placeholder="ادخل اسم الباقة"
          />
          <InputField
            val={gamesCount}
            set={setGamesCount}
            type="number"
            label="عدد الألعاب"
            placeholder="ادخل عدد الألعاب"
          />
          <InputField
            val={price}
            set={setPrice}
            type="number"
            label="السعر"
            placeholder="ادخل السعر"
          />

          <div className="flex flex-col mb-4 w-[48%]">
            <label className="mb-1 text-lg text-center">حالة الباقة</label>
            <select
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
              className="w-full rounded border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
            >
              <option value="1">مفعلة</option>
              <option value="0">غير مفعلة</option>
            </select>
          </div>
        </form>

        <p className="text-center text-xl mt-3">
          هل تريد استرداد المبلغ؟
          <br /> ( {price || "0"} )
        </p>

        <div className="w-full mt-5 flex justify-between gap-4 bg-white btn_save">
          <button
            type="button"
            onClick={submitData}
            className="w-[45%] px-7 py-2 bg-[#085E9C] text-white rounded-md"
          >
            استرداد
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

export default Refund;
