import React from "react";

interface ButtonGroupProps {
  handleSubmit: () => void;
  resetHandle: () => void;
  onClose: () => void;

}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  handleSubmit,
  resetHandle,
  onClose
}) => {
  return (
    <div className="p-4 mt-5 flex justify-between gap-4 bg-white btn_save">
      <button
        onClick={handleSubmit}
        className="px-7 py-2 bg-[#0765AA] text-white rounded-md"
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
        className="px-7 py-2 border  border-[#0765AA] text-[#0765AA] rounded-md"
      >
       إغلاق
      </button>
    </div>
  );
};

export default ButtonGroup;
