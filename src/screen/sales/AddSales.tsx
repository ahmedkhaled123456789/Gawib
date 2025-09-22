import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <div className="flex flex-col  mb-4 w-full ">
      <label className="mb-1 text-lg text-center  ">{label}</label>
      <input
        value={val}
        onChange={(e) => set(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="w-full rounded border border-[#085E9C]  p-3 text-sm shadow-md outline-none text-right"
      />
    </div>
  );
};

// AddAdmins.tsx
const AddSales = ({ onClose }: { onClose: () => void }) => {
  const [date, setDate] = useState("");
  const [count, setCount] = useState("");

  const submitData = () => {
    if (!count || !date) {
      toast.warn("يرجى استكمال جميع الحقول!");
      return;
    }

    // Submit logic here
    toast.success("تمت إضافة المشرف بنجاح!");
    onClose(); // close modal on success
  };

  return (
    <div className="w-[40%] p-5 mb-4">
      <div className="bg-white rounded-md p-5 mb-5">
        <form className="flex flex-wrap items-center justify-center gap-5 pt-5">
          <InputField
            val={count}
            set={setCount}
            type="number"
            label="رقم عملية الاسترداد  "
            placeholder=" "
          />
          <InputField
            val={date}
            set={setDate}
            type="date"
            label="تاريخ الاسترداد  "
            placeholder="تاريخ الاسترداد  "
          />
        </form>
        <p className="text-center  text-xl ">
          هل تريد استرداد المبلغ
          <br />( 150.7 )
        </p>
        <div className="w-full  mt-5 flex justify-between gap-4 bg-white btn_save">
          <button
            onClick={submitData}
            className="w-[45%] px-7 py-2 bg-[#085E9C] text-white rounded-md"
          >
            استرداد
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-[45%] px-7 py-2 border  border-[#085E9C] text-[#085E9C] rounded-md"
          >
            إغلاق
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddSales;
