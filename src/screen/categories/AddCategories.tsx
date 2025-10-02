import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import ButtonGroup from "../../components/ButtonGroup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { getGameById, updateGame } from "../../store/gameSlice";

const AddCategories = ({
  selectedId,
  onClose,
}: {
  selectedId?: string;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // ✅ description
  const [image, setImage] = useState<File | string | null>(null);
  const [isActive, setIsActive] = useState(true); // ✅ is_active (true / false)
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
          setDescription(data?.data.description || "");
          setImage(data?.data.image || null);
          setIsActive(!!data?.data.is_active); // 👈 يحول القيمة لـ true/false
        })
        .catch(() => {
          toast.error("فشل تحميل بيانات الفئة");
        });
    }
  }, [selectedId, dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const submitData = () => {
    if (!name || !description || !image) {
      toast.error("يرجى استكمال جميع الحقول!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("is_active", isActive ? "1" : "0"); // ✅ backend بياخدها 1/0
    formData.append("_method", "PUT");

    if (image instanceof File) {
      formData.append("image", image);
    }

    dispatch(updateGame({ id: selectedId, data: formData }))
      .unwrap()
      .then(() => {
        toast.success("تم تعديل الفئة بنجاح!");
        onClose();
      })
      .catch(() => {
        toast.error("فشل تعديل الفئة");
      });
  };

  const resetHandle = () => {
    setName("");
    setDescription("");
    setImage(null);
    setIsActive(true);
  };

  // ✅ cleanup URLs
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
            <label className="mb-1 text-lg font-bold text-[#085E9C]">
              أسم الفئة
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="w-full bg-[#D5D5D5] rounded border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col w-full">
            <label className="mb-1 text-lg font-bold text-[#085E9C]">
              وصف الفئة
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#D5D5D5] rounded border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
              rows={3}
            />
          </div>

          {/* is_active */}
          <div className="flex flex-col w-full">
            <label className="mb-1 text-lg font-bold text-[#085E9C]">
              حالة الفئة
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 accent-[#085E9C]"
              />
              <span>{isActive ? "منشورة" : "موقوفة"}</span>
            </div>
          </div>

          {/* Image Upload */}
          <div className="w-full flex flex-col">
            <label className="mb-3 text-lg font-bold text-[#085E9C]">
              صورة الفئة
            </label>
            <div
              className="w-full h-[200px] border border-[#085E9C] flex items-center justify-center cursor-pointer rounded-md hover:shadow-lg transition"
              onClick={handleImageClick}
            >
              {image ? (
                <img
                  src={
                    image instanceof File ? URL.createObjectURL(image) : image
                  }
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
          <ButtonGroup
            handleSubmit={submitData}
            resetHandle={resetHandle}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default AddCategories;
