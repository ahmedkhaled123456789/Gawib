import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonGroup from "../../components/ButtonGroup";
import { createDiscountCode } from "../../store/DiscountSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
  

interface InputFieldProps {
  label: string;
  placeholder: string;
  set: React.Dispatch<React.SetStateAction<string>>;
  val: string;
  type: string;
}

const InputField = ({ label, placeholder, set, val,type }: InputFieldProps) => {
  return (
    <div className="flex flex-col text-[#085E9C]   w-[48%] ">
      <label className="mb-1 text-lg font-bold ">{label}</label>
      <input
        value={val}
        onChange={(e) => set(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="w-full rounded border border-[#085E9C]  p-2 text-sm shadow-md outline-none text-right"
      />
    </div>
  );
};

// AddAdmins.tsx
const AddDiscount = ({ onClose }: { onClose: () => void }) => {
      const dispatch = useDispatch<AppDispatch>();
 const [code, setCode] = useState("");
  const [codeType, setCodeType] = useState("");
  const [price, setPrice] = useState("");
   const [codePrice, setCodePrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [Package, setPackage] = useState(""); 
const [discountType, setDiscountType] = useState<"عام" | "خاص" | "">("عام");
 const submitData = () => {
  if (!price || !code || !codeType || !codePrice || !startDate || !endDate || !status || !email || !Package) {
    toast.warn("يرجى استكمال جميع الحقول!");
    return;
  }

  const newDiscount = {
    code,
    discount: Number(code), // assuming discount = percentage
    is_percentage: 1, // أو 0 لو ثابت
    isActive: status === "نشط" // حسب حالتك
  };

  dispatch(createDiscountCode(newDiscount))
    .unwrap()
    .then(() => {
      toast.success("تمت إضافة الكود بنجاح!");
      onClose();
    })
    .catch((err) => {
      toast.error(err);
    });
};
   const resetHandle = () => {
    setPrice("");
    setCode("");
    setCodeType("");
    setCodePrice("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setEmail("");
    setPackage("");

  };

  return (
    <div className="w-[80%] p-5 ">
      <div className="bg-white rounded-md p-4 ">
        <form className="flex flex-wrap items-center justify-center gap-5 pt-5">

            {/* Dropdown */}
           <div className="flex flex-col text-[#085E9C]   w-[48%] ">
             <label className="mb-1 text-lg font-bold">الباقة</label>
                 <select className="w-full rounded border border-[#085E9C]  p-2 text-sm shadow-md outline-none text-right">
            <option value="">باقة 3 العاب</option>
            <option value="">باقة 3 العاب</option>
            <option value="">باقة 3 العاب</option>

           </select>
           </div>
           
          <InputField val={price} set={setPrice} type="number" label="السعر الحالي  " placeholder="أدخل السعر الحالي  " />
          <InputField val={code} set={setCode} type="number" label="نسبة كود الخصم  " placeholder="أدخل   نسبة كود الخصم" />
          <InputField val={codePrice} set={setCodePrice} type="number" label="سعر كود الخصم  " placeholder="أدخل سعر كود الخصم" />
            <InputField val={startDate} set={setStartDate} type="date" label="تاريخ البداية  " placeholder="أدخل تاريخ البداية" />
          <InputField val={endDate} set={setEndDate} type="date" label="تاريخ النهاية  " placeholder="أدخل تاريخ النهاية" />
          <InputField val={Package} set={setPackage} type="text" label="اسم كود الخصم  " placeholder="أدخل اسم كود الخصم" />
         <div className="flex flex-col text-[#085E9C] w-[48%]">
      <label className="mb-1 text-lg font-bold">نوع كود الخصم</label>
      <div className="flex items-center justify-between p-2 border border-[#085E9C] gap-2">
        {/* عام */}
        <div
          onClick={() => setDiscountType("عام")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="p-1 w-6 h-6 border rounded border-[#085E9C]">
            {discountType === "عام" && (
              <img src="/images/group/true.png" alt="selected" className="w-4 h-4" />
            )}
          </span>
          <span>عام</span>
        </div>

        {/* خاص */}
        <div
          onClick={() => setDiscountType("خاص")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="p-1 w-6 h-6 border rounded border-[#085E9C]">
            {discountType === "خاص" && (
              <img src="/images/group/true.png" alt="selected" className="w-4 h-4" />
            )}
          </span>
          <span>خاص</span>
        </div>
      </div>
    </div>
 <div className="flex flex-col text-[#085E9C]   w-full ">
             <label className="mb-1 text-lg font-bold">البريد الإلكتروني </label>
                 <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type='email'
        placeholder='email'
        className="w-full rounded border border-[#085E9C]  p-2 text-sm shadow-md outline-none text-right"
      /> 
           </div>
        </form>
                  <ButtonGroup handleSubmit={submitData} resetHandle={resetHandle} onClose={onClose} />

      </div>
      <ToastContainer />
    </div>
  );
};

export default AddDiscount;


 