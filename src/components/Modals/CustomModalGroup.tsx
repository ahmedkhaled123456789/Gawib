// components/CustomModal.tsx
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { id: string; is_active: false | true }) => void;
  status: boolean;
  id: string;
};

const CustomModalGroup = ({
  isOpen,
  onClose,
  id,
  onConfirm,
  status,
}: Props) => {
  if (!isOpen) return null;

  const isActive = status;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-6 shadow-lg w-full max-w-md border border-blue-300">
        <p className="text-center mb-6">
          {" "}
          {isActive
            ? "الفئة منشورة هل تريد أيقاف النشر"
            : "الفئة موقوفة هل تريد تفعيل النشر"}{" "}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() =>
              onConfirm({
                id,
                is_active: status ? false : true,
              })
            }
            className={`px-4 py-2 text-white rounded ${
              isActive ? "bg-[#ff426e]" : "bg-[#588a17]"
            }`}
          >
            {isActive ? "إيقاف النشر" : "نشر"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#085E9C]  text-[#085E9C] rounded hover:bg-[#085E9C] hover:text-white"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModalGroup;
