// components/CustomModal.tsx

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  status: 'منشورة' | 'موقوفة';
};

const CustomModalGroup = ({ isOpen, onClose, onConfirm, status }: Props) => {
  if (!isOpen) return null;

  const isActive = status === 'منشورة';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-6 shadow-lg w-full max-w-md border border-blue-300">
       
        <p className="text-center mb-6">    {isActive ? 'الفئة منشورة هل تريد أيقاف النشر' : 'الفئة موقوفة هل تريد تفعيل النشر'}    </p>
        <div className="flex justify-center gap-4">
             <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded ${
              isActive ? 'bg-[#ff426e]' : 'bg-[#588a17]'
            }`}
          >
            {isActive ? 'أيقاف النشر' : 'نشر'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#0765AA]  text-[#0765AA] rounded hover:bg-[#0765AA] hover:text-white"
          >
            إغلاق
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default CustomModalGroup;
