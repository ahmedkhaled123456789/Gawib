import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddAdmins from "./AddAdmins";
import CustomModal from "../../components/Modals/CustomModal";
import { AppDispatch, RootState } from "../../store";
import { getAdmins, deleteAdmin } from "../../store/adminSlice";
import { toast } from "sonner";
import { Trash } from "lucide-react";

const SupervisorCard = ({ supervisor, onDelete }) => {
  return (
    <div className="border border-[#085E9C] p-4 rounded shadow bg-white space-y-4">
      {/* Main Info */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-2 items-center font-bold text-[#085E9C]">
        <div className="border rounded border-[#085E9C] p-3 text-center col-span-1">
          {supervisor.name}
        </div>
        <div className="bg-yellow-400 text-center border rounded border-[#085E9C] p-3 col-span-1">
          {supervisor.phone_number}
        </div>
        <div className="bg-yellow-400 text-center border rounded border-[#085E9C] p-3 col-span-1">
          {supervisor.email}
        </div>
        <div className="bg-yellow-400 text-center border rounded border-[#085E9C] p-3 col-span-1">
          Admin
        </div>
        <button
          className="bg-red-500 hover:bg-red-600 text-white border rounded border-[#085E9C] py-3 col-span-1 flex justify-center items-center"
          onClick={() => onDelete(supervisor.id)}
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {supervisor.categories?.map((cat, i) => (
          <div
            key={i}
            className="border font-[500] rounded border-[#085E9C] text-center py-1 text-sm sm:text-base"
          >
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Admins() {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { admins, loading, error } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    dispatch(getAdmins());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    // نعرض Toast للإشعار قبل الحذف
    toast("هل أنت متأكد من حذف هذا المشرف؟", {
      action: {
        label: "نعم",
        onClick: async () => {
          try {
            await dispatch(deleteAdmin(id)).unwrap();
            toast.success("تم حذف المشرف بنجاح");
            dispatch(getAdmins()); // إعادة تحميل البيانات بعد الحذف
          } catch (err) {
            toast("حدث خطأ أثناء الحذف");
          }
        },
      },
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center bg-white border-b-[#085E9C] border-b p-2">
        <h1 className="text-xl font-bold text-[#085E9C]">المشرفين</h1>

        <button
          className="bg-yellow-400 border border-[#085E9C] text-[#085E9C] px-4 py-2 rounded shadow text-md font-bold"
          onClick={() => setShowAdminModal(true)}
        >
          إضافة مشرف
        </button>

        <CustomModal isOpen={showAdminModal}>
          <AddAdmins onClose={() => setShowAdminModal(false)} />
        </CustomModal>
      </div>

      <div className="space-y-6 p-2 pt-10 bg-white">
        {loading && <p>جارٍ التحميل...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {Array.isArray(admins?.data) && admins.data.length > 0
          ? admins.data.map((sup, idx) => (
              <SupervisorCard
                key={idx}
                supervisor={sup}
                onDelete={handleDelete}
              />
            ))
          : !loading && (
              <p className="text-center text-gray-500">
                لا يوجد مشرفين حاليًا.
              </p>
            )}
      </div>
    </div>
  );
}
