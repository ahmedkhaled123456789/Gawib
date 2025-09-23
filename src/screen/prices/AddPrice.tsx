import { useEffect, useRef, useState } from "react";
import {  toast } from "sonner"
import ButtonGroup from "../../components/ButtonGroup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {
  createGamePackage,
  getGamePackageById,
  updateGamePackage,
  GamePackage,
} from "../../store/GamePackagesSlice";

interface InputFieldProps {
  label: string;
  placeholder: string;
  set: React.Dispatch<React.SetStateAction<string>>;
  val: string;
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
    <div className="flex flex-col text-[#085E9C] mb-4 w-full">
      <label className="mb-1 text-lg font-bold">{label}</label>
      <input
        value={val}
        onChange={(e) => set(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="w-full rounded border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
      />
    </div>
  );
};

const AddPrice = ({
  selectedId,
  onClose,
}: {
  selectedId?: string;
  onClose: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [price, setPrice] = useState("");
  const prevId = useRef<string | null>(null);

  // Load existing package if editing
  useEffect(() => {
    if (selectedId && selectedId !== prevId.current) {
      prevId.current = selectedId;
      dispatch(getGamePackageById(selectedId))
        .unwrap()
        .then((data: GamePackage) => {
          setName(data.name);
          setCount(data.games_count.toString()); // تحويل number -> string للـ input
          setPrice(data.price.toString()); // تحويل number -> string للـ input
        })
        .catch(() => {
          toast.error("فشل تحميل البيانات");
        });
    }
  }, [selectedId, dispatch]);

  // Submit handler
  const submitData = () => {
    if (!name || !count || !price) {
      toast.error("يرجى استكمال جميع الحقول!");
      return;
    }

    const payload: Partial<GamePackage> = {
      name,
      games_count: Number(count), // تحويل string -> number
      price: Number(price), // تحويل string -> number
      is_active: "1",
      is_free: 0,
    };

    if (selectedId) {
      // Edit package
      dispatch(updateGamePackage({ id: selectedId, data: payload }))
        .unwrap()
        .then(() => {
          toast.success("تم تعديل الباقة بنجاح!");
          resetHandle();
          onClose();
        })
        .catch((err) => toast.error(err || "حدث خطأ أثناء التعديل"));
    } else {
      // Add new package
      dispatch(createGamePackage(payload))
        .unwrap()
        .then(() => {
          toast.success("تمت إضافة الباقة بنجاح!");
          resetHandle();
          onClose();
        })
        .catch((err) => toast.error(err || "حدث خطأ أثناء الإضافة"));
    }
  };

  const resetHandle = () => {
    setName("");
    setCount("");
    setPrice("");
  };

  return (
    <div className="w-[60%] p-5 mb-4">
      <div className="bg-white rounded-md p-10 mb-5">
        <form className="flex flex-wrap items-center justify-center gap-5 pt-5">
          <InputField
            val={name}
            set={setName}
            type="text"
            label="اسم الباقة"
            placeholder="أدخل اسم الباقة"
          />
          <InputField
            val={count}
            set={setCount}
            type="number"
            label="عدد الألعاب"
            placeholder="أدخل عدد الألعاب"
          />
          <InputField
            val={price}
            set={setPrice}
            type="number"
            label="السعر"
            placeholder="أدخل السعر"
          />
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

export default AddPrice;
