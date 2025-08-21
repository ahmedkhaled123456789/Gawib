import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonGroup from "../../components/ButtonGroup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { getGameById } from "../../store/gameSlice";

const AddCategories = ({ selectedId, onClose }: { selectedId?: string; onClose: () => void }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | string | null>(null); // 👈 يقبل File أو string أو null
  const dispatch = useDispatch<AppDispatch>();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (selectedId) {
      dispatch(getGameById(selectedId))
        .unwrap()
        .then((data) => {
          setName(data?.data.name || "");
          setImage(data?.data.image || null); // 👈 ممكن تكون string
        })
        .catch(() => {
          toast.error("فشل تحميل بيانات الفئة");
        });
    }
  }, [selectedId, dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file); // 👈 هنا بيكون File
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

  // ✅ cleanup URLs عشان تمنع memory leaks
  useEffect(() => {
    let objectUrl: string | undefined;
    if (image instanceof File) {
      objectUrl = URL.createObjectURL(image);
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [image]);

  return (
    <div className="w-[60%] p-5">
      <div className="bg-white rounded-md p-10">
        <form className="flex flex-wrap justify-between gap-4 pt-5">
          {/* Category Name */}
          <div className="flex flex-col w-full">
            <label className="mb-1 text-lg font-bold text-[#085E9C]">أسم الفئة</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="w-full bg-[#D5D5D5] rounded border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
            />
          </div>

          {/* Image Upload */}
          <div className="w-full flex flex-col">
            <label className="mb-3 text-lg font-bold text-[#085E9C]">صورة الفئة</label>
            <div
              className="w-full h-[200px] border border-[#085E9C] flex items-center justify-center cursor-pointer rounded-md hover:shadow-lg transition"
              onClick={handleImageClick}
            >
              {image ? (
                <img
                  src={image instanceof File ? URL.createObjectURL(image) : image} // 👈 check
                  alt="Preview"
                  className="w-[60px] h-[60px]"
                />
              ) : (
                <img
                  src="/images/group/img.png"
                  alt="Placeholder"
                  className="w-[60px] h-[60px]"
                />
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
