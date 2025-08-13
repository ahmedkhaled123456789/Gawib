import React from "react";

interface ButtonGroupProps {
 handleSubmit: (e?: React.FormEvent) => void;  resetHandle: () => void;
  onClose: () => void;

}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  handleSubmit,
  resetHandle,
  onClose
}) => {
  return (
    <div className="p-4 mt-4 flex justify-between gap-4 bg-white btn_save">
      <button
        onClick={handleSubmit}
        className="px-7 py-2 bg-[#085E9C] text-white rounded-md"
      >
        حفظ
      </button>
      <button
        type="button"
        onClick={resetHandle}
        className="px-7 py-2 bg-[#ff426e] text-white rounded-md"
      >
       إلغاء
      </button>
       <button
        type="button"
        onClick={onClose}
        className="px-7 py-2 border  border-[#085E9C] text-[#085E9C] rounded-md"
      >
       إغلاق
      </button>
    </div>
  );
};

export default ButtonGroup;
