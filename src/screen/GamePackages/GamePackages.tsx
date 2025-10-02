import { useEffect, useState, useMemo } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  getGamePackages,
  createGamePackage,
  deleteGamePackage,
  updateGamePackage,
} from "../../store/GamePackagesSlice";
import CustomModal from "../../components/Modals/CustomModal";
import AddGamePackage from "./AddGamePackage";
import EditeGamePackage from "./EditeGamePackage";
import { EditIcon, Loader2, Trash } from "lucide-react";
import { toast } from "sonner";

// ✅ hook للـ debounce
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const GamePackages = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { gamePackages, loading } = useSelector(
    (state: RootState) => state.gamePackage
  );

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  // @ts-ignore
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("-created_at");
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPackageId, setEditPackageId] = useState<string>("");

  const [togglingId, setTogglingId] = useState<string | null>(null); // ✅ حالة التحميل للتفعيل/التعطيل

  // ✅ جلب الباقات
  useEffect(() => {
    dispatch(
      getGamePackages({
        page: currentPage,
        search: debouncedSearch,
        sort: sortBy,
      })
    );
  }, [dispatch, currentPage, debouncedSearch, sortBy]);

  // ✅ فلترة الباقات
  const filteredPackages = useMemo(() => {
    return gamePackages?.data?.filter((pkg: any) => {
      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "مفعل" && pkg.is_active === true) ||
        (statusFilter === "غير مفعل" && pkg.is_active !== true);
      return matchesStatus;
    });
  }, [gamePackages?.data, statusFilter]);

  // ✅ إضافة باقة جديدة
  const handleSavePackage = async (data: {
    name: string;
    games_count: number;
    price: number;
    is_active: 0 | 1;
  }) => {
    try {
      await dispatch(createGamePackage(data)).unwrap();
      return Promise.resolve();
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  // ✅ حذف باقة
  const handleDelete = (id: string) => {
    toast("هل تريد حذف الباقة؟", {
      action: {
        label: "نعم",
        onClick: async () => {
          const deletingToast = toast.loading("جارٍ حذف الباقة...");
          try {
            await dispatch(deleteGamePackage(id)).unwrap();
            toast.success("تم حذف الباقة بنجاح", { id: deletingToast });
          } catch (err: any) {
            toast.error(err?.message || "فشل حذف الباقة", {
              id: deletingToast,
            });
          }
        },
      },
      cancel: {
        label: "تراجع",
        onClick: () => console.log("Canceled"),
      },
    });
  };

  // ✅ فتح نافذة تعديل
  const handleEditOpen = (id: string) => {
    setEditPackageId(id);
    setShowEditModal(true);
  };

  // ✅ تغيير حالة الباقة (تفعيل/إلغاء)
  const handleToggleActive = async (pkg: any) => {
    setTogglingId(pkg.id); // ابدأ التحميل
    const updatingToast = toast.loading("جارٍ تحديث الحالة...");
    try {
      await dispatch(
        updateGamePackage({
          id: pkg.id,
          data: { ...pkg, is_active: pkg.is_active ? 0 : 1 },
        })
      ).unwrap();
      toast.success("تم تحديث حالة الباقة", { id: updatingToast });
    } catch (err: any) {
      toast.error(err?.message || "فشل تحديث الحالة", { id: updatingToast });
    } finally {
      setTogglingId(null); // انهي التحميل
    }
  };

  // ✅ صف الجدول
  const GameRow = ({ pkg }: { pkg: any }) => (
    <tr key={pkg.id} className="text-center whitespace-nowrap">
      <td className="px-4 py-2">{pkg.id}</td>
      <td className="px-4 py-2">{pkg.name}</td>
      <td className="px-4 py-2">{pkg.games_count}</td>
      <td className="px-4 py-2">{pkg.price}</td>
      <td className="px-4 py-2">{pkg.number_of_buys}</td>

      {/* ✅ الحالة النصية */}
      <td className="px-4 py-2">
        {pkg.is_active ? (
          <span className="text-green-600 font-semibold">مفعل</span>
        ) : (
          <span className="text-red-600 font-semibold">غير مفعل</span>
        )}
      </td>

      <td className="px-4 py-2">{pkg.created_at}</td>
      <td className="px-4 py-2">{pkg.updated_at}</td>

      {/* ✅ الأكشنات كلها في مكان واحد */}
      <td className="flex items-center gap-2 justify-center py-2">
        {/* زر التعديل */}
        <button
          className="px-3 py-1 rounded bg-[#085E9C] text-white font-semibold text-sm hover:bg-[#0a6bb9] transition flex items-center justify-center"
          onClick={() => handleEditOpen(pkg.id)}
          title="تعديل"
        >
          <EditIcon size={18} />
        </button>

        {/* زر الحذف */}
        <button
          onClick={() => handleDelete(pkg.id)}
          className="text-red-600 hover:text-red-800"
          disabled={loading}
          title="حذف"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Trash size={18} />
          )}
        </button>

        {/* ✅ زر التفعيل/التعطيل مع loading */}
        <span
          onClick={() => handleToggleActive(pkg)}
          className="p-1 border cursor-pointer rounded border-[#085E9C] inline-flex items-center justify-center hover:bg-gray-100 min-w-[28px] min-h-[28px]"
          title={pkg.is_active ? "إلغاء التفعيل" : "تفعيل"}
        >
          {togglingId === pkg.id ? (
            <Loader2 size={18} className="animate-spin text-[#085E9C]" />
          ) : (
            <img
              src="/images/group/true.png"
              alt="active"
              className={`w-5 h-5 transition-opacity duration-200 ${
                pkg.is_active ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="overflow-x-auto mx-2">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row p-4 bg-white items-start md:items-center gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-auto">
          <div className="text-md font-bold text-[#085E9C]">باقة الألعاب</div>

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

          <CustomDropdown
            options={[
              { value: "-created_at", label: "الأحدث" },
              { value: "created_at", label: "الأقدم" },
              { value: "-number_of_buys", label: "الأكثر شراء" },
              { value: "number_of_buys", label: "الأقل شراء" },
            ]}
            selected={sortBy}
            onChange={setSortBy}
          />
        </div>

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

      {/* Edit Game Modal */}
      <CustomModal isOpen={showEditModal}>
        {editPackageId && (
          <EditeGamePackage
            packageId={editPackageId}
            onClose={() => setShowEditModal(false)}
          />
        )}
      </CustomModal>
    </div>
  );
};

export default GamePackages;
