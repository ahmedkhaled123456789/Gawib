import { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonGroup from "../../components/ButtonGroup";

 
 
const AddCategories = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState("");
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
    if (!name || !image) {
      toast.warn("يرجى استكمال جميع الحقول!");
      return;
    }
    toast.success("تمت إضافة المجموعة بنجاح!");
    onClose();
  };

  const resetHandle = () => {
    setName("");
    setImage(null);
  };

  return (
    <div className="w-[60%]   p-5    ">
      <div className="bg-white rounded-md p-10 ">
      

        {/* Form Fields */}
        <form className="flex flex-wrap justify-between gap-4 pt-5 text-[#0765AA]">
          
    {/* Product Type */}
        <div className="flex flex-col  w-full  text-[#0765AA]">
          <label className="mb-1 text-lg font-bold">  أسم الفئة  </label>
          
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      type="text"
      placeholder="جغرافيا والعالم"
      className="w-full bg-[#D5D5D5]  rounded border border-[#0765AA] p-3 text-sm shadow-md outline-none text-right"
    />
         </div>
         {/* Image Upload */}
            <div className="w-full  flex flex-col ">
              <label className="mb-3 text-lg font-bold">صورة الفئة  </label>
              <div
                className="w-full h-[200px]   border border-[#0765AA] flex items-center justify-center cursor-pointer rounded-md hover:shadow-lg transition"
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
        </form>

        {/* Buttons */}
        <div className="mt-8">
          <ButtonGroup handleSubmit={submitData} resetHandle={resetHandle} onClose={onClose} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddCategories;

 