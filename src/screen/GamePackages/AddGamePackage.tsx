import { useState } from "react";
import { toast } from "sonner";

type AddGamePackageProps = {
  onClose: () => void;
  // onSave now returns a Promise so AddGamePackage can await result and show errors
  onSave: (data: {
    name: string;
    games_count: number;
    price: number;
    is_free: 0 | 1;
    is_active: 0 | 1;
  }) => Promise<void>;
};

const AddGamePackage = ({ onClose, onSave }: AddGamePackageProps) => {
  const [name, setName] = useState("");
  const [gamesCount, setGamesCount] = useState<number>();
  const [price, setPrice] = useState<number>();
  const [isFree, setIsFree] = useState<0 | 1>(0);
  const [isActive, setIsActive] = useState<0 | 1>(1);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !gamesCount || !price) {
      toast.error("يرجى استكمال جميع الحقول!");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name,
        games_count: gamesCount,
        price,
        is_free: isFree,
        is_active: isActive,
      });
      toast.success("تم حفظ الباقة بنجاح!");
      onClose();
    } catch (err: any) {
      // err could be a string (from rejectWithValue) or an object.
      let message = "حدث خطأ غير متوقع";
      if (typeof err === "string") message = err;
      else if (err && typeof err === "object") {
        // try common shapes:
        if (err.message) message = err.message;
        else if (err.errors?.name?.[0]) message = err.errors.name[0];
        else if (err?.errors && typeof err.errors === "object") {
          // pick first string we find
          const first = Object.values(err.errors).flat?.()[0];
          if (typeof first === "string") message = first;
        }
      }
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 w-full max-w-md bg-white rounded-md shadow-md border border-gray-200">
      <h2 className="text-center text-lg font-bold mb-4 text-[#085E9C]">
        إضافة باقة جديدة
      </h2>

      <div className="flex flex-col gap-3">
        <label className="font-semibold text-[#085E9C]">اسم الباقة</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-[#085E9C] rounded px-3 py-2 focus:outline-none"
          placeholder="ادخل اسم الباقة"
        />

        <label className="font-semibold text-[#085E9C]">عدد الألعاب</label>
        <input
          type="number"
          value={gamesCount}
          onChange={(e) => setGamesCount(Number(e.target.value))}
          className="border border-[#085E9C] rounded px-3 py-2 focus:outline-none"
          min={1}
        />

        <label className="font-semibold text-[#085E9C]">السعر</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border border-[#085E9C] rounded px-3 py-2 focus:outline-none"
          min={0}
        />

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={isFree === 1}
            onChange={() => setIsFree(isFree === 1 ? 0 : 1)}
            className="w-4 h-4"
          />
          <span className="text-[#085E9C] font-medium">الباقة مجانية</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive === 1}
            onChange={() => setIsActive(isActive === 1 ? 0 : 1)}
            className="w-4 h-4"
          />
          <span className="text-[#085E9C] font-medium">تفعيل الباقة</span>
        </div>

        <div className="flex justify-between gap-2 mt-4">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`flex-1 ${
              saving ? "opacity-70 cursor-not-allowed" : ""
            } bg-[#085E9C] text-white py-2 rounded hover:bg-blue-700`}
          >
            {saving ? "جارٍ الحفظ..." : "حفظ"}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 border border-[#085E9C] text-[#085E9C] py-2 rounded hover:bg-[#085E9C] hover:text-white"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGamePackage;
