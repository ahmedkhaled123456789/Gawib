import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonGroup from "../../components/ButtonGroup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { createAdmin } from "../../store/adminSlice";
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

interface InputFieldProps {
  label: string;
  set: React.Dispatch<React.SetStateAction<string>>;
  val: string;
  type: string;
}

const InputField = ({ label, set, val, type }: InputFieldProps) => {
  return (
    <div className="flex flex-col text-[#085E9C] mb-4 w-full lg:w-[45%]">
      <label className="mb-1 text-lg font-bold">{label}</label>
      <input
        value={val}
        onChange={(e) => set(e.target.value)}
        type={type}
        className="w-full rounded border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
      />
    </div>
  );
};

const AddAdmins = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");

  const resetHandle = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
  };

  const submitData = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone_number || !email || !password) {
      toast.warn("يرجى استكمال جميع الحقول!");
      return;
    }

    const newAdmin = {
      name,
      email,
      password,
      phone_number, // هيكون +20xxxx
      is_super_admin: 1,
      is_active: 1,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("فشل الإرسال");
    }
  };

  return (
    <div className="w-full p-5 mb-4">
      <div className="bg-white rounded-md p-10 mb-5">
        <form
          onSubmit={submitData}
          className="flex flex-wrap items-center justify-center gap-5 pt-5"
        >
          <InputField val={name} set={setName} type="text" label="الأسم" />
          <InputField val={email} set={setEmail} type="email" label="البريد الإلكتروني" />
          <InputField val={password} set={setPassword} type="password" label="كلمة المرور" />

          <div className="flex flex-col text-[#085E9C] mb-4 w-full lg:w-[45%]">
            <label className="mb-1 text-lg font-bold">رقم الهاتف</label>
            <PhoneInput
              country={"eg"}
              value={phone_number.replace("+", "")}
              onChange={(value: string) => setPhoneNumber(`+${value}`)}
              inputProps={{
                name: "phone_number",
                dir: "rtl",
              }}
              containerStyle={{ direction: "rtl" }}
              inputStyle={{
                width: "100%",
                textAlign: "right",
                borderRadius: "6px",
                paddingRight: "50px",
                padding: "20px 10px",
              }}
              buttonStyle={{
                backgroundColor: "transparent",
                border: "none",
                position: "absolute",
                left: "0",
              }}
            />
          </div>

          <ButtonGroup
            handleSubmit={submitData}
            resetHandle={resetHandle}
            onClose={onClose}
          />
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddAdmins;
