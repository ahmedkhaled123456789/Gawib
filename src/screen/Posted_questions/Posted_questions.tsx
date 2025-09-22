import { useEffect, useState } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  getGamePackages,
  createGamePackage,
  deleteGamePackage, // ✅ مهم تضيفه
} from "../../store/GamePackagesSlice";
import CustomModal from "../../components/Modals/CustomModal";
import AddGamePackage from "./AddGamePackage";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";

// ================= PostedGames Component =================
const PostedGames = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { gamePackages, loading } = useSelector(
    (state: RootState) => state.gamePackage
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(getGamePackages(currentPage));
  }, [dispatch, currentPage]);

  const filteredPackages = gamePackages?.data?.filter((pkg: any) => {
    const matchesSearch = pkg.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "مفعل" && pkg.is_active === "1") ||
      (statusFilter === "غير مفعل" && pkg.is_active !== "1");
    return matchesSearch && matchesStatus;
  });

  const handleSavePackage = async (data: {
    name: string;
    games_count: number;
    price: number;
    is_free: 0 | 1;
    is_active: 0 | 1;
  }) => {
    try {
      const payload = { ...data, is_active: data.is_active.toString() };
      await dispatch(createGamePackage(payload)).unwrap();
      toast.success("تمت إضافة الباقة بنجاح");
      return Promise.resolve();
    } catch (err: any) {
      toast.error(err?.message || "حدث خطأ أثناء الحفظ");
      return Promise.reject(err || "حدث خطأ أثناء الحفظ");
    }
  };

const handleDelete = (id: string) => {
  toast("هل تريد حذف الباقة؟", {
    action: {
      label: "نعم",
      onClick: async () => {
        const deletingToast = toast.loading("جارٍ حذف الباقة..."); // 👈 يظهر لودر
        try {
          await dispatch(deleteGamePackage(id)).unwrap();
          toast.success("تم حذف الباقة بنجاح", { id: deletingToast }); // 👈 يستبدل اللودر بنجاح
        } catch (err: any) {
          toast.error(err?.message || "فشل حذف الباقة", { id: deletingToast }); // 👈 يستبدل اللودر بخطأ
        }
      },
    },
    cancel: {
      label: "تراجع",
      onClick: () => console.log("Canceled"),
    },
  });
};


  // ================= GameRow Component =================
  const GameRow = ({ pkg }: { pkg: any }) => (
    <tr key={pkg.id} className="text-center whitespace-nowrap">
      <td className="px-4 py-2">{pkg.id}</td>
      <td className="px-4 py-2">{pkg.name}</td>
      <td className="px-4 py-2">{pkg.games_count}</td>
      <td className="px-4 py-2">{pkg.price}</td>
      <td className="px-4 py-2">{pkg.number_of_buys}</td>
      <td className="px-4 py-2">
        {pkg.is_active === "1" ? "مفعل" : "غير مفعل"}
      </td>
      <td className="px-4 py-2">{pkg.created_at}</td>
      <td className="px-4 py-2">{pkg.updated_at}</td>
      <td className="px-4 py-2">
        <button
          onClick={() => handleDelete(pkg.id)}
          className="text-red-600 hover:text-red-800"
          disabled={loading}
          title="حذف"
        >
          {loading ? <Loader2 size={18} className="animate-spin"/> : <Trash size={18} />}
        </button>
      </td>
    </tr>
  );

  return (
    <div className="overflow-x-auto mx-2">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row p-4 bg-white items-start md:items-center gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-auto">
          <div className="text-md font-bold text-[#085E9C]">باقة الألعاب</div>

          {/* Search */}
          <div className="relative w-full md:w-48 border rounded-md border-[#085E9C]">
            <input
              type="text"
              placeholder="البحث باسم الباقة"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-8 pr-4 border border-gray-300 rounded-md focus:outline-none"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-500" />
          </div>

          {/* Status Filter */}
          <CustomDropdown
            options={[
              { value: "", label: "الكل" },
              { value: "مفعل", label: "مفعل" },
              { value: "غير مفعل", label: "غير مفعل" },
            ]}
            selected={statusFilter}
            onChange={setStatusFilter}
          />
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#085E9C] text-white rounded hover:bg-blue-700"
        >
          <FiPlus />
          إضافة باقة
        </button>
      </div>

      {/* Game Packages Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full table-auto divide-y divide-[#085E9C] bg-white text-sm text-center">
          <thead>
            <tr className="px-4 py-2 font-medium text-[#085E9C] whitespace-nowrap">
              <th>ID</th>
              <th>اسم الباقة</th>
              <th>عدد الألعاب</th>
              <th>السعر</th>
              <th>عدد الشراء</th>
              <th>الحالة</th>
              <th>تاريخ الإنشاء</th>
              <th>تاريخ التحديث</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPackages?.length > 0 ? (
              filteredPackages.map((pkg: any) => (
                <GameRow key={pkg.id} pkg={pkg} />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-2 text-gray-700">
                  لا توجد باقات.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {gamePackages?.meta?.last_page && (
        <div className="mt-4 flex justify-start">
          <Pagination
            pageCount={gamePackages.meta.last_page}
            onPress={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Add Game Modal */}
      <CustomModal isOpen={showAddModal}>
        <AddGamePackage
          onClose={() => setShowAddModal(false)}
          onSave={handleSavePackage}
        />
      </CustomModal>
    </div>
  );
};

export default PostedGames;
