import { useEffect, useState } from "react";
import { toast } from "sonner";
import ButtonGroup from "../../components/ButtonGroup";
import {
  getDiscountCodeById,
  updateDiscountCode,
} from "../../store/DiscountSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import {
  getGamePackagesWithoutPagination,
  GamePackage,
} from "../../store/GamePackagesSlice";
import { Loader2 } from "lucide-react";

const EditDiscount = ({
  selectedId,
  onClose,
}: {
  selectedId: string;
  onClose: () => void;
}) => {
  const { gamePackages, loading, error } = useSelector(
    (state: RootState) => state.gamePackage
  );
  const dispatch = useDispatch<AppDispatch>();

  const [code, setCode] = useState<string | number>("");
  const [price, setPrice] = useState<string | number>("");
  const [codePrice, setCodePrice] = useState<string | number>("0");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [emails, setEmails] = useState<string[]>([]);
  const [discountCodeName, setDiscountCodeName] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<string | number>("");
  const [discountType, setDiscountType] = useState<number>(0);

  // 🟢 loader للحفظ
  const [isSaving, setIsSaving] = useState(false);

  // جلب بيانات الكود المختار
  useEffect(() => {
    if (selectedId) {
      dispatch(getDiscountCodeById(selectedId))
        .unwrap()
        .then((data) => {
          const discountData = data?.data;

          setPrice(discountData?.game_package?.price?.toString() || "0");
          setCode(discountData?.discount || "");
          setCodePrice(discountData?.discounted_price?.toString() || "0");
          setStartDate(discountData?.starts_at?.split(" ")[0] || "");
          setEndDate(discountData?.ends_at?.split(" ")[0] || "");
          setEmails(discountData?.emails || []);
          setDiscountCodeName(discountData?.code || "");
          setDiscountType(discountData?.type || 0);
          setSelectedPackage(discountData?.game_package?.id?.toString() || "");
        })
        .catch(() => {
          toast.error("فشل تحميل بيانات الكود");
        });
    }
  }, [selectedId, dispatch]);

  // جلب الباقات
  useEffect(() => {
    dispatch(getGamePackagesWithoutPagination());
  }, [dispatch]);

  // حساب السعر بعد الخصم
  useEffect(() => {
    if (price && code) {
      const discounted = Number(price) - (Number(price) * Number(code)) / 100;
      setCodePrice(discounted.toString());
    } else {
      setCodePrice(price);
    }
  }, [price, code]);

  // تغيير الباقة
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

  // تعديل الايميلات
  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmailField = () => setEmails([...emails, ""]);
  const removeEmailField = (index: number) =>
    setEmails(emails.filter((_, i) => i !== index));

  // حفظ البيانات
  const submitData = () => {
    if (!price || !discountCodeName || !code || !startDate || !endDate) {
      toast.error("يرجى استكمال جميع الحقول!");
      return;
    }

    if (/\s/.test(discountCodeName)) {
      toast.error("اسم كود الخصم لا يمكن أن يحتوي على مسافات!");
      return;
    }

    const updatedDiscount = {
      game_package_id: selectedPackage,
      discount: code,
      starts_at: startDate,
      ends_at: endDate,
      type: discountType,
      code: discountCodeName,
      ...(discountType === 1 && {
        emails: emails.filter((e) => e.trim() !== ""),
      }),
    };

    setIsSaving(true); // بدأ الحفظ
    dispatch(updateDiscountCode({ id: selectedId, data: updatedDiscount }))
      .unwrap()
      .then(() => {
        toast.success("تم تحديث كود الخصم بنجاح!");
        onClose();
      })
      .catch(() => toast.error("حدث خطأ أثناء تحديث الكود"))
      .finally(() => setIsSaving(false)); // وقف الـ loader
  };

  // Reset form
  const resetHandle = () => {
    setPrice("");
    setCode("");
    setCodePrice("0");
    setStartDate("");
    setEndDate("");
    setEmails([]);
    setDiscountCodeName("");
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

          {/* Discount Percentage */}
          <div className="flex flex-col text-[#085E9C] w-[48%]">
            <label className="mb-1 text-lg font-bold">نسبة كود الخصم</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              type="number"
              placeholder="أدخل نسبة كود الخصم"
              className="w-full rounded border border-[#085E9C] p-2 text-sm shadow-md outline-none text-right"
            />
          </div>

          {/* Discount Price */}
          <div className="flex flex-col text-[#085E9C] w-[48%]">
            <label className="mb-1 text-lg font-bold">سعر كود الخصم</label>
            <div className="w-full rounded border border-[#085E9C] p-2 text-sm shadow-md outline-none text-right">
              {codePrice || "0"}
            </div>
          </div>

          {/* Start Date */}
          <div className="flex flex-col text-[#085E9C] w-[48%]">
            <label className="mb-1 text-lg font-bold">تاريخ البداية</label>
            <input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              className="w-full rounded border border-[#085E9C] p-2 text-sm shadow-md outline-none text-right"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col text-[#085E9C] w-[48%]">
            <label className="mb-1 text-lg font-bold">تاريخ النهاية</label>
            <input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              className="w-full rounded border border-[#085E9C] p-2 text-sm shadow-md outline-none text-right"
            />
          </div>

          {/* Discount Code Name */}
          <div className="flex flex-col text-[#085E9C] w-[48%]">
            <label className="mb-1 text-lg font-bold">اسم كود الخصم</label>
            <input
              value={discountCodeName}
              onChange={(e) => {
                const value = e.target.value.replace(/\s/g, "").toUpperCase();
                setDiscountCodeName(value);
              }}
              type="text"
              placeholder="أدخل اسم كود الخصم"
              className="w-full rounded border border-[#085E9C] p-2 text-sm shadow-md outline-none text-right"
            />
          </div>

          {/* Discount Type */}
          <div className="flex flex-col text-[#085E9C] w-[48%]">
            <label className="mb-1 text-lg font-bold">نوع كود الخصم</label>
            <div className="flex items-center justify-between p-2 border border-[#085E9C] gap-2">
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

          {/* Email for private discount */}
          {discountType === 1 && (
            <div className="flex flex-col text-[#085E9C] w-full">
              <label className="mb-1 text-lg font-bold">
                البريد الإلكتروني
              </label>

              {emails.map((em, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    value={em}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    type="email"
                    placeholder="email"
                    className="w-full rounded border border-[#085E9C] p-2 text-sm shadow-md outline-none text-right"
                  />
                  <button
                    type="button"
                    onClick={() => removeEmailField(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    حذف
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addEmailField}
                className="px-3 py-1 bg-green-500 text-white rounded mt-2"
              >
                + إضافة إيميل
              </button>
            </div>
          )}
        </form>

        <div className="flex items-center justify-center mt-5">
          {isSaving ? (
            <button
              disabled
              className="flex items-center gap-2 bg-[#085E9C] text-white px-4 py-2 rounded"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري الحفظ...
            </button>
          ) : (
            <ButtonGroup
              handleSubmit={submitData}
              resetHandle={resetHandle}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditDiscount;
