
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  status: 'نشط' | 'موقوف';
};

const CustomModal = ({ isOpen, onClose, onConfirm, status }: Props) => {
  if (!isOpen) return null;

  const isActive = status === 'نشط';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-6 shadow-lg w-full max-w-md border border-blue-300">
       
        <p className="text-center mb-6">هل تريد {isActive ? 'إيقاف' : 'تفعيل'} هذا المستخدم</p>
        <div className="flex justify-center gap-4">
             <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded ${
              isActive ? 'bg-[#ff426e]' : 'bg-[#588a17]'
            }`}
          >
            {isActive ? 'إيقاف' : 'تفعيل'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#085E9C] text-[#085E9C] rounded hover:bg-[#085E9C] hover:text-white"
          >
            إغلاق
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
