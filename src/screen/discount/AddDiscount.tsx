import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ButtonGroup from "../../components/ButtonGroup";
import {
  createDiscountCode,
  getDiscountCodeById,
  updateDiscountCode,
} from "../../store/DiscountSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { getGamePackages, GamePackage } from "../../store/GamePackagesSlice";

interface InputFieldProps {
  label: string;
  placeholder: string;
  set: React.Dispatch<React.SetStateAction<string>>;
  val: string | number;
  type: string;
}

const InputField = ({
  label,
  placeholder,
  set,
  val,
  type,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col text-[#085E9C] w-[48%]">
      <label className="mb-1 text-lg font-bold">{label}</label>
      <input
        value={val}
        onChange={(e) => set(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="w-full rounded border border-[#085E9C] p-2 text-sm shadow-md outline-none text-right"
      />
    </div>
  );
};

const AddDiscount = ({
  selectedId,
  onClose,
}: {
  selectedId?: string;
  onClose: () => void;
}) => {
  const { gamePackages, loading, error } = useSelector(
    (state: RootState) => state.gamePackage
  );
  const dispatch = useDispatch<AppDispatch>();

  const [code, setCode] = useState<string | number>("");
  const [price, setPrice] = useState<string | number>("");
  const [codePrice, setCodePrice] = useState<string | number>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [Package, setPackage] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<string | number>("");

  const [discountType, setDiscountType] = useState<number | boolean>(0);
  const prevId = useRef<string | null>(null);

  // Load discount data if editing
  useEffect(() => {
    if (selectedId && selectedId !== prevId.current) {
      prevId.current = selectedId;
      dispatch(getDiscountCodeById(selectedId))
        .unwrap()
        .then((data) => {
          setPrice(data?.data?.game_package.price.toString() || "0");
          setCode(data?.data?.discount || "");
          setCodePrice(data?.data?.discounted_price.toString() || "0");
          setStartDate(data?.data?.starts_at || "");
          setEndDate(data?.data?.ends_at || "");
          setEmail(data?.data?.emails || "");
          setPackage(data?.data?.game_package.name || "");
          setDiscountType(data?.data?.type || 0);
          setSelectedPackage(data?.data?.game_package.id || "");
        })
        .catch(() => {
          toast.error("فشل تحميل بيانات الكود");
        });
    }
  }, [selectedId, dispatch]);

  // Load all game packages
  useEffect(() => {
    dispatch(getGamePackages(1));
  }, [dispatch]);

  // Calculate discounted price
  useEffect(() => {
    if (price && code) {
      const discounted = Number(price) - (Number(price) * Number(code)) / 100;
      setCodePrice(discounted.toString());
    } else {
      setCodePrice(price);
    }
  }, [price, code]);

  const handleChangeDrop = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pkgId = e.target.value;
    setSelectedPackage(pkgId);

    const selectedPkg = gamePackages?.data.find(
      (pkg: GamePackage) => pkg.id.toString() === pkgId
    );

    if (selectedPkg) {
      setPrice(selectedPkg.price.toString());
    } else {
      setPrice("");
    }
  };

  const submitData = () => {
    if (!price || !Package || !code) {
      toast.error("يرجى استكمال جميع الحقول!");
      return;
    }

    const newDiscount = {
      game_package_id: selectedPackage,
      discount: codePrice.toString(),
      type: discountType,
      email: discountType === 1 ? email : null,
      starts_at: startDate,
      ends_at: endDate,
      code: Package,
    };

    if (selectedId) {
      dispatch(updateDiscountCode({ id: selectedId, data: newDiscount }))
        .unwrap()
        .then(() => {
          toast.success("تم تحديث الكود بنجاح!");
          onClose();
        })
        .catch((err) => {
          toast.error(err || "حدث خطأ أثناء الحفظ");
        });
    } else {
      dispatch(createDiscountCode(newDiscount))
        .unwrap()
        .then(() => {
          toast.success("تمت إضافة الكود بنجاح!");
          onClose();
        })
        .catch((err) => {
          toast.error(err || "حدث خطأ أثناء الحفظ");
        });
    }
  };

  const resetHandle = () => {
    setPrice("");
    setCode("");
    setCodePrice("");
    setStartDate("");
    setEndDate("");
    setEmail("");
    setPackage("");
    setSelectedPackage("");
    setDiscountType(0);
  };

  return (
    <div className="w-[80%] p-5">
      <div className="bg-white rounded-md p-4">
        <form className="flex flex-wrap items-center justify-center gap-5 pt-5">
          {/* Dropdown */}
          <div className="flex flex-col text-[#085E9C] w-[48%]">
            <label className="mb-1 text-lg font-bold">الباقة</label>

            {loading ? (
              <p>جاري التحميل...</p>
            ) : error ? (
              <p className="text-red-500">حدث خطأ أثناء جلب البيانات</p>
            ) : (
              <select
                className="w-full rounded border border-[#085E9C] p-2 text-sm shadow-md outline-none text-right"
                value={selectedPackage}
                onChange={handleChangeDrop}
              >
                <option value="">اختر الباقة</option>
                {gamePackages?.data.map((pkg: GamePackage) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Current Price */}
          <div className="flex flex-col text-[#085E9C] w-[48%]">
            <label className="mb-1 text-lg font-bold">السعر الحالي</label>
            <div className="w-full rounded border border-[#085E9C] p-2 text-sm shadow-md outline-none text-right">
              {price || 0}
            </div>
          </div>

          <InputField
            val={code}
            set={setCode}
            type="number"
            label="نسبة كود الخصم"
            placeholder="أدخل نسبة كود الخصم"
          />

          {/* Discounted Price */}
          <div className="flex flex-col text-[#085E9C] w-[48%]">
            <label className="mb-1 text-lg font-bold">سعر كود الخصم</label>
            <div className="w-full rounded border border-[#085E9C] p-2 text-sm shadow-md outline-none text-right">
              {codePrice || "0"}
            </div>
          </div>

          <InputField
            val={startDate}
            set={setStartDate}
            type="date"
            label="تاريخ البداية"
            placeholder="أدخل تاريخ البداية"
          />
          <InputField
            val={endDate}
            set={setEndDate}
            type="date"
            label="تاريخ النهاية"
            placeholder="أدخل تاريخ النهاية"
          />
          <InputField
            val={Package}
            set={setPackage}
            type="text"
            label="اسم كود الخصم"
            placeholder="أدخل اسم كود الخصم"
          />

          {/* Discount Type */}
          <div className="flex flex-col text-[#085E9C] w-[48%]">
            <label className="mb-1 text-lg font-bold">نوع كود الخصم</label>
            <div className="flex items-center justify-between p-2 border border-[#085E9C] gap-2">
              {/* عام */}
              <div
                onClick={() => setDiscountType(0)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="p-1 w-6 h-6 border rounded border-[#085E9C]">
                  {discountType === 0 && (
                    <img
                      src="/images/group/true.png"
                      alt="selected"
                      className="w-4 h-4"
                    />
                  )}
                </span>
                <span>عام</span>
              </div>

              {/* خاص */}
              <div
                onClick={() => setDiscountType(1)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="p-1 w-6 h-6 border rounded border-[#085E9C]">
                  {discountType === 1 && (
                    <img
                      src="/images/group/true.png"
                      alt="selected"
                      className="w-4 h-4"
                    />
                  )}
                </span>
                <span>خاص</span>
              </div>
            </div>
          </div>

          {/* Email input for private discount */}
          {discountType === 1 && (
            <div className="flex flex-col text-[#085E9C] w-full">
              <label className="mb-1 text-lg font-bold">
                البريد الإلكتروني
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="email"
                className="w-full rounded border border-[#085E9C] p-2 text-sm shadow-md outline-none text-right"
              />
            </div>
          )}
        </form>

        <ButtonGroup
          handleSubmit={submitData}
          resetHandle={resetHandle}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default AddDiscount;
