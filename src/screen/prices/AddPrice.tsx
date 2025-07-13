import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonGroup from "../../components/ButtonGroup";
 

interface InputFieldProps {
  label: string;
  placeholder: string;
  set: React.Dispatch<React.SetStateAction<string>>;
  val: string;
  type: string;
}

const InputField = ({ label, placeholder, set, val,type }: InputFieldProps) => {
  return (
    <div className="flex flex-col text-[#085E9C] mb-4 w-full ">
      <label className="mb-1 text-lg font-bold ">{label}</label>
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
const AddPrice = ({ onClose }: { onClose: () => void }) => {
 const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [price, setPrice] = useState("");

  const submitData = () => {
    if (!name || !count || !price) {
      toast.warn("يرجى استكمال جميع الحقول!");
      return;
    }

    // Submit logic here
    toast.success("تمت إضافة المشرف بنجاح!");
    onClose(); // close modal on success
  };
   const resetHandle = () => {
    setName("");
    setCount("");
    setPrice("");

  };
  return (
    <div className="w-[60%] p-5 mb-4">
      <div className="bg-white rounded-md p-10 mb-5">
        <form className="flex flex-wrap items-center justify-center gap-5 pt-5">
          <InputField val={name} set={setName} type="text" label="اسم الباقة" placeholder="أدخل اسم الباقة" />
          <InputField val={count} set={setCount} type="number" label="عدد الألعاب" placeholder="أدخل عدد الألعاب" />
          <InputField val={price} set={setPrice} type="number" label="السعر  " placeholder="أدخل السعر" />
  
        </form>
                  <ButtonGroup handleSubmit={submitData} resetHandle={resetHandle} onClose={onClose} />

      </div>
      <ToastContainer />
    </div>
  );
};

export default AddPrice;


 