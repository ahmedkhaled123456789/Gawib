import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {
  getGamePackageById,
  updateGamePackage,
} from "../../store/GamePackagesSlice";

type EditGamePackageProps = {
  packageId: string;
  onClose: () => void;
};

const EditeGamePackage = ({ packageId, onClose }: EditGamePackageProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [gamesCount, setGamesCount] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [isActive, setIsActive] = useState<0 | 1>(1);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const res: any = await dispatch(getGamePackageById(packageId)).unwrap();
        const pkg = res.data || res;

        setName(pkg.name || "");
        setGamesCount(pkg.games_count ? Number(pkg.games_count) : "");
        setPrice(pkg.price ? Number(pkg.price) : "");

        // ✅ تحويل is_free & is_active من Boolean → 0/1
        setIsActive(pkg.is_active === true || pkg.is_active === 1 ? 1 : 0);
      } catch (err) {
        toast.error("فشل جلب بيانات الباقة");
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [packageId, dispatch]);

  const handleSubmit = async () => {
    if (!name.trim() || gamesCount === "" || price === "") {
      toast.error("يرجى استكمال جميع الحقول!");
      return;
    }

    setSaving(true);
    try {
      await dispatch(
        updateGamePackage({
          id: packageId,
          data: {
            name,
            games_count: Number(gamesCount),
            price: Number(price),
            is_active: isActive, // 0 أو 1
          },
        })
      ).unwrap();

      toast.success("تم تعديل الباقة بنجاح!");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "حدث خطأ أثناء التعديل");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-md bg-white rounded-md shadow-md border border-gray-200">
      <h2 className="text-center text-lg font-bold mb-4 text-[#085E9C]">
        تعديل الباقة
      </h2>

      <div className="flex flex-col gap-3">
        <label className="font-semibold text-[#085E9C]">اسم الباقة</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-[#085E9C] rounded px-3 py-2 focus:outline-none"
        />

        <label className="font-semibold text-[#085E9C]">عدد الألعاب</label>
        <input
          type="number"
          value={gamesCount}
          onChange={(e) =>
            setGamesCount(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="border border-[#085E9C] rounded px-3 py-2 focus:outline-none"
          min={1}
        />

        <label className="font-semibold text-[#085E9C]">السعر</label>
        <input
          type="number"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="border border-[#085E9C] rounded px-3 py-2 focus:outline-none"
          min={0}
        />

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
            className={`flex-1 flex items-center justify-center ${
              saving ? "opacity-70 cursor-not-allowed" : ""
            } bg-[#085E9C] text-white py-2 rounded hover:bg-blue-700`}
          >
            {saving ? <Loader2 className="animate-spin h-5 w-5" /> : "تعديل"}
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

export default EditeGamePackage;
