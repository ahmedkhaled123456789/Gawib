import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { createGame } from "../../store/gameSlice";
import { getAllCategoriesForDropdown } from "../../store/categoriesSlice";
import { toast } from "sonner";

interface AddNewCategoriesProps {
  onClose: () => void;
  adminId: number;
}

const AddNewCategories = ({ onClose, adminId }: AddNewCategoriesProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { dropdownCategories } = useSelector(
    (state: RootState) => state.categories
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    dispatch(getAllCategoriesForDropdown());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast.error("يرجى اختيار الفئه");
      return;
    }

    const formData = new FormData();
    formData.append("category_id", selectedCategory);
    formData.append("name", name);
    formData.append("description", description);
    if (image) formData.append("image", image);
    formData.append("is_active", isActive ? "1" : "0");
    formData.append("admin_id", adminId.toString());

    try {
      if (!name.trim() || !description.trim() || !selectedCategory.trim()) {
        toast.error("يرجى ملء جميع الحقول المطلوبة");
        return;
      }
      setLoading(true);
      await dispatch(createGame(formData)).unwrap(); // Use correct action for creating
      toast.success("تم حفظ التصنيف بنجاح!");
      onClose();
    } catch (err) {
      toast.error(err as string); // ⬅️ هنا التعديل
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => fileInputRef.current?.click();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  return (
    <div className="w-full p-5">
      <div className="bg-white rounded-md p-4 border shadow">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-[#085E9C] font-bold">اسم المجموعه</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-[#085E9C] rounded px-3 py-2 text-sm outline-none"
          >
            <option value="">-- اختر اسم المجموعة --</option>
            {dropdownCategories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <label className="text-[#085E9C] font-bold">اسم الفئه الجديد</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-[#085E9C] rounded px-3 py-2 text-sm outline-none"
            placeholder="ادخل اسم الفئه"
            required
          />

          <label className="text-[#085E9C] font-bold">الوصف</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-[#085E9C] rounded px-3 py-2 text-sm outline-none"
            rows={3}
            placeholder="ادخل الوصف"
          />

          <label className="text-[#085E9C] font-bold">الصورة</label>
          <div
            className="border border-[#085E9C] flex justify-center items-center h-60 cursor-pointer rounded-lg overflow-hidden"
            onClick={handleImageClick}
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className=" h-[240px] object-cover rounded-lg"
              />
            ) : (
              <img
                src="/images/group/img.png"
                alt="Placeholder"
                className="w-[100px] h-[100px]"
              />
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <label className="text-[#085E9C] font-semibold text-lg flex items-center gap-x-2">
            نشط
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4"
            />
          </label>

          <div className="flex justify-between gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#085E9C] text-white rounded p-2 flex justify-center items-center gap-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                  <span>جارٍ الحفظ...</span>
                </>
              ) : (
                "حفظ"
              )}
            </button>

            <button
              type="reset"
              onClick={() => {
                setName("");
                setDescription("");
                setImage(null);
                setSelectedCategory("");
              }}
              className="flex-1 bg-[#ff426e] text-white rounded p-2"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#085E9C] text-[#085E9C] rounded p-2"
            >
              إغلاق
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewCategories;
