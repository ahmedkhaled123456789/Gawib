import { useEffect, useState } from "react";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import EditDiscount from "./EditDiscount";
import AddDiscount from "./AddDiscount";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  deleteDiscountCode,
  getDiscountCodes,
} from "../../store/DiscountSlice";
import { toast } from "sonner";
import { EditIcon, Trash2Icon, Search } from "lucide-react";

// صف الجدول
const ProductRow = ({
  product,
  setSelectedId,
  setShowPriceModal,
  setIsEditMode,
  handleDelete,
}) => (
  <tr className="text-sm sm:text-base">
    <td className="px-2 sm:px-4 py-2 font-medium text-gray-900">
      {product.id}
    </td>
    <td className="px-2 sm:px-4 py-2 text-gray-700 truncate max-w-[120px]">
      <div className="truncate">{product.code}</div>
    </td>
    <td className="px-2 sm:px-4 py-2 text-gray-700">
      {product.game_package?.name || "-"}
    </td>
    <td className="px-2 sm:px-4 py-2 text-gray-700">
      {product.game_package?.price || "0"}
    </td>
    <td className="px-2 sm:px-4 py-2 text-gray-700">
      {product.discounted_price}
    </td>
    <td className="px-2 sm:px-4 py-2 text-gray-700 whitespace-nowrap">
      {product.starts_at}
    </td>
    <td className="px-2 sm:px-4 py-2 text-gray-700 whitespace-nowrap">
      {product.ends_at}
    </td>
    <td className="px-2 sm:px-4 py-2 text-gray-700">
      {product.type === 0 ? "عام" : "خاص"}
    </td>
    <td
      className={`px-2 sm:px-4 py-2 ${
        product.status === "active" ? "text-[#588A17]" : "text-[#ff426e]"
      }`}
    >
      {product.status === "active" ? "نشط" : "منتهي"}
    </td>
    <td className="px-2 sm:px-4 py-2">
      <div className="flex items-center justify-center gap-2">
        <span
          className="p-1 border cursor-pointer rounded bg-[#085E9C] text-white"
          onClick={() => {
            setSelectedId(product._id || product.id);
            setIsEditMode(true);
            setShowPriceModal(true);
          }}
        >
          <EditIcon className="w-5 h-5" />
        </span>
        <span
          className="p-1 border cursor-pointer rounded-md bg-red-700 text-white"
          onClick={() => handleDelete(product._id || product.id)}
        >
          <Trash2Icon className="w-5 h-5" />
        </span>
      </div>
    </td>
  </tr>
);

const Discount = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { discountCodes } = useSelector(
    (state: RootState) => state.discountCodes
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortFilter, setSortFilter] = useState("");
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    dispatch(
      getDiscountCodes({
        page: 1,
        search: searchQuery || undefined,
        status: statusFilter || undefined,
        sort: sortFilter || undefined,
      })
    );
  }, [dispatch, searchQuery, statusFilter, sortFilter]);

  const handleDelete = (id: string | number) => {
    toast("هل تريد حذف كود الخصم؟", {
      action: {
        label: "نعم",
        onClick: () => {
          dispatch(deleteDiscountCode(id))
            .unwrap()
            .then(() => toast.success("تم حذف الكود بنجاح!"))
            .catch(() => toast.error("حدث خطأ أثناء الحذف"));
        },
      },
    });
  };

  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row p-4 bg-white items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
            <div className="text-lg sm:text-xl font-bold text-[#085E9C]">
              كود خصم
            </div>
            <div className="relative w-full sm:w-48 border rounded-md border-[#085E9C]">
              <input
                type="text"
                placeholder="ابحث ب كود الخصم"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none"
              />
              <Search className="absolute w-4 h-4 left-3 top-3 text-gray-500" />
            </div>
            <CustomDropdown
              options={[
                { value: "", label: "الأحدث" },
                { value: "created_at", label: "الاحدث" },
                { value: "-created_at", label: "الاقدم" },
              ]}
              selected={sortFilter}
              onChange={setSortFilter}
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {[
              { value: "active", label: "نشط", className: "text-[#588A17]" },
              {
                value: "inactive",
                label: "منتهي",
                className: "text-[#7e7e7e]",
              },
              { value: "deleted", label: "محذوف", className: "text-[#ff426e]" },
            ].map((s) => (
              <span
                key={s.value}
                onClick={() =>
                  setStatusFilter((prev) => (prev === s.value ? "" : s.value))
                }
                className={`cursor-pointer border border-[#085E9C] rounded px-3 py-1 text-sm ${
                  statusFilter === s.value
                    ? "bg-[#085E9C] text-white"
                    : s.className
                }`}
              >
                {s.label}
              </span>
            ))}
          </div>

          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-[#085E9C] border border-[#085E9C] px-4 py-1 rounded text-sm font-medium w-full sm:w-auto"
            onClick={() => {
              setSelectedId(null);
              setIsEditMode(false);
              setShowPriceModal(true);
            }}
          >
            إضافة كود خصم
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#085E9C] bg-white text-xs sm:text-sm">
            <thead className="text-center">
              <tr className="font-medium text-[#085E9C]">
                {[
                  "ID",
                  "كود الخصم",
                  "الباقة",
                  "السعر الحالي",
                  "سعر كود الخصم",
                  "تاريخ البداية",
                  "تاريخ النهاية",
                  "نوع كود الخصم",
                  "حالة كود الخصم",
                  "إدارة",
                ].map((h) => (
                  <th key={h} className="px-2 sm:px-4 py-2 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y text-center divide-gray-200">
              {discountCodes?.data?.length > 0 ? (
                discountCodes.data.map((product, index) => (
                  <ProductRow
                    key={index}
                    product={product}
                    setSelectedId={setSelectedId}
                    setShowPriceModal={setShowPriceModal}
                    setIsEditMode={setIsEditMode}
                    handleDelete={handleDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-4 py-2 text-gray-700">
                    لم يتم العثور على أكواد خصم.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {discountCodes?.meta?.last_page && (
          <Pagination
            pageCount={discountCodes.meta.last_page}
            onPress={(page) =>
              dispatch(
                getDiscountCodes({
                  page,
                  search: searchQuery || undefined,
                  status: statusFilter || undefined,
                  sort: sortFilter || undefined,
                })
              )
            }
          />
        )}

        {/* Modal للإضافة أو التعديل */}
        <CustomModal isOpen={showPriceModal}>
          {isEditMode ? (
            selectedId && (
              <EditDiscount
                selectedId={selectedId}
                onClose={() => setShowPriceModal(false)}
              />
            )
          ) : (
            <AddDiscount onClose={() => setShowPriceModal(false)} />
          )}
        </CustomModal>
      </div>
    </div>
  );
};

export default Discount;
