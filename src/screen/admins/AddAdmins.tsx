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
    <div className="flex flex-col text-[#0765AA] mb-4 w-full  lg:w-[45%]">
      <label className="mb-1 text-lg font-bold ">{label}</label>
      <input
        value={val}
        onChange={(e) => set(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="w-full rounded border border-[#0765AA]  p-3 text-sm shadow-md outline-none text-right"
      />
    </div>
  );
};

// AddAdmins.tsx
const AddAdmins = ({ onClose }: { onClose: () => void }) => {
 const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [jop, setJop] = useState("");
   const [password, setPassword] = useState("");


  const submitData = () => {
    if (!name || !phone || !email || !jop || !password) {
      toast.warn("يرجى استكمال جميع الحقول!");
      return;
    }

    // Submit logic here
    toast.success("تمت إضافة المشرف بنجاح!");
    onClose(); // close modal on success
  };
   const resetHandle = () => {
    setName("");
    setPassword("");
    setPhone("");
    setEmail("");
    setJop("");
     
  };
  return (
    <div className="w-full p-5 mb-4">
      <div className="bg-white rounded-md p-10 mb-5">
        <form className="flex flex-wrap items-center justify-center gap-5 pt-5">
          <InputField val={name} set={setName} type="text" label="الأسم" placeholder="أدخل اسم مشرف" />
          <InputField val={phone} set={setPhone} type="number" label="الجوال" placeholder="أدخل الجوال" />
          <InputField val={email} set={setEmail} type="email" label="البريد الإلكتروني" placeholder="أدخل البريد الإلكتروني" />
          <InputField val={jop} set={setJop} type="text" label="الوظيفة" placeholder="أدخل الوظيفة" />
          <InputField val={password} set={setPassword} type="password" label="كلمة المرور" placeholder="أدخل كلمة المرور" />

          <ButtonGroup handleSubmit={submitData} resetHandle={resetHandle} onClose={onClose} />
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddAdmins;


 