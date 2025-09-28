// src/pages/groups/UpdateGroup.tsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { getCategory, updateCategory } from "../../store/categoriesSlice";
import { toast } from "sonner";
import Loader from "../../components/Loader";

const UpdateGroup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { category, loading, error } = useSelector(
    (state: RootState) => state.categories
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (id) dispatch(getCategory({ id }));
  }, [id, dispatch]);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setIsActive(category.is_active || false);
      setImagePreview(category.image || null);
    }
  }, [category]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("is_active", isActive ? "1" : "0");

    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Laravel يتطلب هذا عند استخدام PUT مع FormData
    formData.append("_method", "PUT");

    try {
      const resultAction = await dispatch(
        updateCategory({ id: id!, formData })
      );

      if (updateCategory.fulfilled.match(resultAction)) {
        toast.success("تم تعديل المجموعة بنجاح!");
        navigate("/groups");
      } else {
        toast.error("حدث خطأ أثناء التعديل");
      }
    } catch {
      toast.error("فشل الاتصال بالسيرفر");
    }
  };

  if (loading || !category) {
    return <Loader />;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto shadow-lg rounded-md p-6 mt-6 bg-white">
      <h1 className="text-2xl font-bold text-[#085E9C] mb-6">تعديل المجموعة</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        encType="multipart/form-data"
      >
        {/* Name */}
        <div>
          <label className="block mb-2 font-bold text-[#085E9C]">
            اسم المجموعة
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#085E9C] focus:border-[#085E9C]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-bold text-[#085E9C]">
            وصف المجموعة
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#085E9C] focus:border-[#085E9C]"
          />
        </div>

        {/* Image */}
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-2 font-bold text-[#085E9C]">
            صورة المجموعة
          </label>
          <div
            className="w-full h-[200px] border border-[#085E9C] flex items-center justify-center cursor-pointer rounded-md hover:shadow-lg transition"
            onClick={handleImageClick}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-full object-contain"
              />
            ) : (
              <span className="text-gray-500">اضغط لاختيار صورة</span>
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

        {/* Status Checkbox */}
        <div className="flex items-center space-x-2 space-x-reverse col-span-1 md:col-span-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
            className="w-4 h-4 text-[#085E9C] border-gray-300 rounded focus:ring-[#085E9C]"
          />
          <label className="text-sm font-medium text-gray-700">منشورة</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end col-span-1 md:col-span-2 gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition disabled:opacity-50"
          >
            رجوع
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-[#085E9C] text-white rounded-md hover:bg-[#064a7c] transition flex items-center gap-2 disabled:opacity-70"
          >
            حفظ
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateGroup;
