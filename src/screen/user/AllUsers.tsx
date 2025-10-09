import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { EditIcon, Loader2, Trash2Icon } from "lucide-react";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import Dashboard from "../../components/Dashboard/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  getUser,
  updateUser,
  setSearchQuery,
  deleteUser,
} from "../../store/userSlice";
import { getCounts } from "../../store/adminSlice";
import Loader from "../../components/Loader";
import { toast } from "sonner";

// === Row component ===
const ProductRow = ({
  product,
  onStatusClick,
  onDeleteClick,
  loadingStatus,
  loadingDelete,
}: any) => (
  <tr key={product.id}>
    <td className="px-2 py-2 font-medium text-gray-900">{product.id}</td>
    <td className="px-2 py-2 text-gray-700">
      {product.first_name} {product.last_name}
    </td>
    <td className="px-2 py-2 text-gray-700 truncate">{product.email}</td>
    <td className="px-2 py-2 text-gray-700 truncate">{product.phone_number}</td>
    <td className="px-2 py-2 text-gray-700">{product.nationality || "_"}</td>
    <td className="px-2 py-2 text-gray-700">{product.created_at || "_"}</td>
    <td className="px-2 py-2 text-gray-700">{product.played_games ?? "_"}</td>
    <td className="px-2 py-2 text-gray-700">
      <div className="w-14">
        <div
          className={`w-2 h-2 p-2 rounded-md ${
            product.status ? "bg-[#5da401]" : "bg-transparent"
          }`}
        ></div>
      </div>
    </td>
    <td className="px-2 py-2 text-gray-700">
      {product.total_purchases_amount ?? "_"}
    </td>
    <td className="px-2 py-2 flex gap-2 justify-center">
      {/* زر الحالة */}
      <button
        onClick={onStatusClick}
        className={`flex-1 min-w-[70px] px-3 py-1 rounded font-semibold flex items-center justify-center gap-1 text-xs md:text-sm ${
          product.status ? "bg-[#5da401]" : "bg-[#fa2154]"
        }`}
        disabled={loadingStatus}
      >
        {loadingStatus ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : product.status ? (
          "نشط"
        ) : (
          "موقوف"
        )}
      </button>

      {/* زر  التعديل*/}
      <Link to={`/user/${product.id}`}>
        <button className="flex-1 min-w-[70px] px-3 py-1 rounded bg-[#085E9C] text-white font-semibold text-xs md:text-sm hover:bg-[#0a6bb9] transition flex items-center justify-center">
          <EditIcon />
        </button>
      </Link>

      {/* زر الحذف */}
      <button
        onClick={onDeleteClick}
        className="flex-1 min-w-[70px] px-3 py-1 rounded bg-[#d31d48] text-white font-semibold text-xs md:text-sm hover:bg-[#d9363e] transition flex items-center justify-center"
        disabled={loadingDelete}
      >
        {loadingDelete ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : (
          <Trash2Icon />
        )}
      </button>
    </td>
  </tr>
);

const AllUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, currentPage, searchQuery } = useSelector(
    (state: RootState) => state.user
  );
  const { counts } = useSelector((state: RootState) => state.admin);

  // === loading منفصل لكل عملية ===
  const [loadingStatusIds, setLoadingStatusIds] = useState<{
    [key: string]: boolean;
  }>({});
  const [loadingDeleteIds, setLoadingDeleteIds] = useState<{
    [key: string]: boolean;
  }>({});
  const [sortOption, setSortOption] = useState<string>("");

  useEffect(() => {
    dispatch(
      getUser({ page: currentPage, search: searchQuery, sort: sortOption })
    );
    dispatch(getCounts());
  }, [dispatch, currentPage, searchQuery, sortOption]);

  const handleSearch = (e: any) => dispatch(setSearchQuery(e.target.value));

  // ===== تغيير الحالة =====
  const handleStatusClick = async (product: any) => {
    try {
      setLoadingStatusIds((prev) => ({ ...prev, [product.id]: true }));
      await dispatch(
        updateUser({ id: product.id, status: !product.status })
      ).unwrap();
      toast.success(
        `تم تحديث حالة المستخدم: ${!product.status ? "نشط" : "موقوف"}`
      );
    } catch (err: any) {
      toast.error(err?.message || "حدث خطأ أثناء تحديث الحالة");
    } finally {
      setLoadingStatusIds((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  // ===== حذف المستخدم =====
  const handleDeleteUser = (id: string) => {
    toast("هل أنت متأكد من حذف المستخدم؟", {
      action: {
        label: "نعم",
        onClick: async () => {
          try {
            setLoadingDeleteIds((prev) => ({ ...prev, [id]: true }));
            await dispatch(deleteUser(id)).unwrap();
            toast.success("تم حذف المستخدم بنجاح");
          } catch (err: any) {
            toast.error(err?.message || "حدث خطأ أثناء حذف المستخدم");
          } finally {
            setLoadingDeleteIds((prev) => ({ ...prev, [id]: false }));
          }
        },
      },
    });
  };

  const onPress = async (page: number) => {
    await dispatch(getUser({ page, search: searchQuery, sort: sortOption }));
  };

  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
        <Dashboard counts={counts} />
        {/* Header */}
        <div className="flex flex-col w-full md:flex-row p-4 bg-white items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
            <div className="text-xl font-bold text-[#085E9C]">المستخدمين</div>

            <div className="relative w-full max-w-xs md:w-64 border rounded-md border-[#085E9C]">
              <input
                type="number"
                placeholder="البحث برقم الهاتف"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-500" />
            </div>

            {/* Dropdown */}
            <CustomDropdown
              options={[
                { value: "", label: "الأحدث" },
                { value: "nationality", label: "الجنسية" },
                { value: "created_at", label: "تاريخ التسجيل" },
                { value: "games", label: "عدد الألعاب" },
                { value: "buys", label: "المشتريات" },
                { value: "status", label: "حالة الحساب" },
              ]}
              selected={sortOption}
              onChange={(value) => setSortOption(value)}
            />
          </div>

          <div>
            <Link
              to="/add-user"
              className="px-4 py-2 text-white bg-[#085E9C] rounded-md text-lg font-medium hover:bg-[#064a7c] transition-colors"
            >
              إضافة مستخدم
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#085E9C] bg-white text-sm min-w-[700px]">
            <thead className="text-right">
              <tr className="px-2 py-2 font-medium text-center text-[#085E9C] whitespace-nowrap">
                <th>ID</th>
                <th>الأسم</th>
                <th>البريد الإلكتروني</th>
                <th>رقم الجوال</th>
                <th>الجنسية</th>
                <th>تاريخ التسجيل</th>
                <th>عدد الألعاب</th>
                <th>نشط الان</th>
                <th>إجمالي المشتريات</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y text-center divide-gray-200">
              {users?.data?.length ? (
                users.data.map((product, index) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    index={index}
                    onStatusClick={() => handleStatusClick(product)}
                    onDeleteClick={() =>
                      handleDeleteUser(product.id.toString())
                    }
                    loadingStatus={!!loadingStatusIds[product.id]}
                    loadingDelete={!!loadingDeleteIds[product.id]}
                  />
                ))
              ) : loading ? (
                <tr>
                  <td colSpan={10}>
                    <Loader />
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={10}>لم يتم العثور على مستخدمين.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {users?.meta?.last_page && (
          <Pagination pageCount={users.meta.last_page} onPress={onPress} />
        )}
      </div>
    </div>
  );
};

export default AllUsers;
