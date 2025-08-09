import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonGroup from "../../components/ButtonGroup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { createAdmin } from "../../store/adminSlice";
 

interface InputFieldProps {
  label: string;
  set: React.Dispatch<React.SetStateAction<string>>;
  val: string;
  type: string;
}

const InputField = ({ label, set, val,type }: InputFieldProps) => {
  return (
    <div className="flex flex-col text-[#085E9C] mb-4 w-full  lg:w-[45%]">
      <label className="mb-1 text-lg font-bold ">{label}</label>
      <input
        value={val}
        onChange={(e) => set(e.target.value)}
        type={type}
        className="w-full rounded border border-[#085E9C]  p-3 text-sm shadow-md outline-none text-right"
      />
    </div>
  );
};

// AddAdmins.tsx
const AddAdmins = ({ onClose }: { onClose: () => void }) => {
   const dispatch = useDispatch<AppDispatch>();
 const [name, setName] = useState("");
  const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");


  const submitData = async (e) => {
    e.preventDefault();
  if (!name  || !email  || !password) {
    toast.warn("يرجى استكمال جميع الحقول!");
    return;
  }

  const newAdmin = {
    name,
     email,
     password,
    is_super_admin: 1,
    is_active: 1
  };

  try {
    const resultAction = await dispatch(createAdmin(newAdmin));

    if (createAdmin.fulfilled.match(resultAction)) {
      toast.success("تمت إضافة المشرف بنجاح!");
      resetHandle();
      onClose();
    } else {
      toast.error("حدث خطأ أثناء الإضافة");
    }
  } catch (error) {
    toast.error("فشل الإرسال");
  }
};




   const resetHandle = () => {
    setName("");
    setPassword("");
     setEmail("");
      
  };
  return (
    <div className="w-full p-5 mb-4">
      <div className="bg-white rounded-md p-10 mb-5">
        <form className="flex flex-wrap items-center justify-center gap-5 pt-5">
          <InputField val={name} set={setName} type="text" label="الأسم"  />
           <InputField val={email} set={setEmail} type="email" label="البريد الإلكتروني"  />
           <InputField val={password} set={setPassword} type="password" label="كلمة المرور" />

          <ButtonGroup handleSubmit={submitData} resetHandle={resetHandle} onClose={onClose} />
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddAdmins;


 