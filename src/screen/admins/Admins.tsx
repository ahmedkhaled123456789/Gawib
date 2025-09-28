import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddAdmins from "./AddAdmins";
import CustomModal from "../../components/Modals/CustomModal";
import { AppDispatch, RootState } from "../../store";
import { getAdmins, deleteAdmin } from "../../store/adminSlice";
import { toast } from "sonner";
import { Trash, EditIcon } from "lucide-react";
import { Link } from "react-router-dom";

const SupervisorCard = ({ supervisor, onDelete }) => {
  return (
    <div className="border border-[#085E9C] p-4 rounded shadow bg-white space-y-4">
      {/* Main Info */}
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-4 xl:grid-cols-6 gap-8 w-full items-center font-bold text-[#085E9C] text-base">
          <div className="border rounded border-[#085E9C] p-4 text-center col-span-1 min-w-[200px]">
            {supervisor.name}
          </div>
          <div className="bg-yellow-400 text-center border rounded border-[#085E9C] p-4 col-span-1 min-w-[200px]">
            {supervisor.phone_number}
          </div>
          <div className="bg-yellow-400 text-center border rounded border-[#085E9C] p-4 col-span-1 min-w-[200px]">
            {supervisor.email}
          </div>
          <div className="bg-yellow-400 text-center border rounded border-[#085E9C] p-4 col-span-1 min-w-[200px]">
            Admin
          </div>

          {/* Edit + Delete Buttons */}
          <div className="flex justify-center items-center gap-3 col-span-2 md:col-span-1 flex-wrap min-w-[150px]">
            <Link to={`/admin/edit/${supervisor.id}`}>
              <button className="px-4 py-2 rounded bg-[#085E9C] text-white font-semibold text-sm hover:bg-[#0a6bb9] transition flex items-center justify-center">
                <EditIcon className="w-5 h-5" />
              </button>
            </Link>

            <button
              className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 flex justify-center items-center"
              onClick={() => onDelete(supervisor.id)}
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {supervisor.categories?.map((cat, i) => (
          <div
            key={i}
            className="border font-[500] rounded border-[#085E9C] text-center py-1 text-sm sm:text-base truncate"
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

  const { admins, loading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(getAdmins());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    toast("هل أنت متأكد من حذف هذا المشرف؟", {
      action: {
        label: "نعم",
        onClick: async () => {
          try {
            await dispatch(deleteAdmin(id)).unwrap();
            toast.success("تم حذف المشرف بنجاح");
            dispatch(getAdmins());
          } catch (err) {
            toast("حدث خطأ أثناء الحذف");
          }
        },
      },
    });
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white border-b-[#085E9C] border-b p-2 gap-4">
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

      {/* Supervisor List */}
      <div className="space-y-6 p-2 pt-10 bg-white">
        {loading && <p className="text-center">جارٍ التحميل...</p>}

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
