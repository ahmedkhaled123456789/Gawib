import { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonGroup from "../../components/ButtonGroup";

interface InputFieldProps {
  label: string;
   set: React.Dispatch<React.SetStateAction<string>>;
  val: string;
  type: string;
}

const InputField = ({ label, set, val, type }: InputFieldProps) => (
  <div className="flex flex-col  mb-2 w-[48%]">
    <label className="mb-2 text-lg text-[#085E9C] font-bold">{label}</label>
    <input
      value={val}
      onChange={(e) => set(e.target.value)}
      type={type}
      className="w-full text-black rounded-sm border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
    />
  </div>
);

const AddGroup = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState("دول وعواصم");
  const [type, setType] = useState("جغرافيا والعالم");
  const [admin, setAdmin] = useState("ماهر البوعلي");
  const [role, setRole] = useState("هذه الفئة تختص بدولة ما وعاصمتها وعملتها ولغتها ");
  const [image, setImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const submitData = () => {
    if (!name || !type || !admin || !role || !image) {
      toast.warn("يرجى استكمال جميع الحقول!");
      return;
    }
    toast.success("تمت إضافة المجموعة بنجاح!");
    onClose();
  };

  const resetHandle = () => {
    setName("");
    setType("");
    setAdmin("");
    setRole("");
    setImage(null);
  };

  return (
    <div className="w-[70%] px-5 font-medium   ">
      <div className="bg-white rounded-md p-6 ">
        {/* Product Type */}
        <div className="flex flex-col  w-full  ">
          <label className="mb-2 text-lg text-[#085E9C] font-bold">نوع الفئة </label>
          
    <input
      value={type}
      onChange={(e) => setType(e.target.value)}
      type={type}
       className="w-full bg-[#D5D5D5]  rounded-sm border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
    />
         </div>

        {/* Form Fields */}
        <form className="flex flex-wrap justify-between gap-4 pt-5 text-[#085E9C]">
          <InputField val={name} set={setName} type="text" label="أسم الفئة"  />
          <InputField val={admin} set={setAdmin} type="text" label="أسم المشرف"  />

  
          {/* Instructions + Image Upload Row */}
          <div className="flex flex-wrap   justify-between  w-full gap-4 ">
            {/* Instructions */}
            <div className="w-full md:w-[48%] ">
              <label className="mb-2 text-lg font-bold block">تعليمات الفئة</label>
              <textarea
                className="w-full resize-none h-[190px] text-black border border-[#085E9C] rounded-sm p-3 text-sm outline-none text-right  shadow-md"
              >
                هذه الفئة تختص بدولة ما وعاصمتها وعملتها ولغتها
              </textarea>
            </div>

            {/* Image Upload */}
            <div className="w-full md:w-[48%] flex flex-col ">
              <label className="mb-2 text-lg font-bold">صورة الفئة الرئيسية</label>
              <div
                className="w-full h-[190px]   border border-[#085E9C] flex items-center justify-center cursor-pointer rounded-sm hover:shadow-lg transition"
                onClick={handleImageClick}
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-[60px] h-[60px] "
                  />
                ) : (
                  <img src="/images/group/img.png" alt="Placeholder" className="w-[60px] h-[60px]" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </form>

        {/* Buttons */}
        <div className="">
          <ButtonGroup handleSubmit={submitData} resetHandle={resetHandle} onClose={onClose} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddGroup;
