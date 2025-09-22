// pages/admin/Sales.tsx
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import AddSales from "./AddSales";
import { getPayments, deletePayment } from "../../store/payment";
import { toast } from "sonner";

const ProductRow = ({ product, setShowModal, dispatch }) => {
  const handleDelete = () => {
    toast("هل تريد الحذف؟", {
      action: {
        label: "نعم",
        onClick: () => {
          dispatch(deletePayment(product.id));
          toast.success("تم الحذف بنجاح");
        },
      },
    });
  };

  return (
    <tr key={product.id} className="text-xs sm:text-sm">
      <td className="px-2 sm:px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
        {product.id}
      </td>
      {/* بيانات العميل */}
      <td className="px-2 sm:px-4 py-2 text-gray-700 whitespace-nowrap">
        <Link to={`/productDetails/${product.id}`}>
          {product.user?.first_name} {product.user?.last_name}
        </Link>
      </td>
      <td className="px-2 sm:px-4 py-2 text-gray-700 truncate max-w-[140px]">
        {product.user?.email || "_"}
      </td>
      <td className="px-2 sm:px-4 py-2 text-gray-700 whitespace-nowrap">
        {product.user?.phone_number || "_"}
      </td>
      <td className="px-2 sm:px-4 py-2 text-gray-700 whitespace-nowrap">
        {product.user?.nationality || "_"}
      </td>

      {/* بيانات الفاتورة */}
      <td className="px-2 sm:px-4 py-2 text-gray-700 whitespace-nowrap">
        {product.order_id}
      </td>
      <td
        className="px-2 sm:px-4 py-2 text-gray-700 truncate max-w-[100px]"
        title={product.transaction_ref || "_"}
      >
        {product.transaction_ref || "_"}
      </td>
      <td className="px-2 sm:px-4 py-2 text-gray-700 whitespace-nowrap">
        {product.created_at || "_"}
      </td>

      {/* الدفع */}
      <td className="px-2 sm:px-4 py-2 text-gray-700 whitespace-nowrap">
        {product.payment_method}
      </td>
      <td className="px-2 sm:px-4 py-2 text-gray-700 whitespace-nowrap">
        {product.paytabs_response?.payment_info?.card_scheme || "_"} -
        {product.paytabs_response?.payment_info?.card_type || "_"}
      </td>
      <td className="px-2 sm:px-4 py-2 text-gray-700 truncate max-w-[140px]">
        {product.paytabs_response?.payment_description || "_"}
      </td>
      <td className="px-2 sm:px-4 py-2 text-gray-700 whitespace-nowrap">
        {product.amount} {product.paytabs_response?.cart_currency || ""}
      </td>
      <td className="px-2 sm:px-4 py-2 text-gray-700 whitespace-nowrap">
        {product.tax || "_"}
      </td>
      <td className="px-2 sm:px-4 py-2 text-gray-700 whitespace-nowrap">
        {product.net_amount || product.amount}
      </td>

      {/* الحالة */}
      <td className="px-2 sm:px-4 py-2 text-gray-700 whitespace-nowrap">
        {product.status === 1 ? (
          <span className="text-green-600 font-medium">ناجحة</span>
        ) : (
          <span className="text-red-600 font-medium">فاشلة</span>
        )}
        <div className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[120px]">
          {product.paytabs_response?.payment_result?.response_message}
        </div>
      </td>

      {/* إدارة */}
      <td className="px-2 sm:px-4 py-2">
        <div className="flex items-center justify-center gap-2">
          {/* زر الطباعة */}
          <span className="p-1 border cursor-pointer rounded bg-[#085E9C]">
            <img
              src="/images/group/print.png"
              alt="print"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          </span>

          {/* زر الاسترداد */}
          <span
            className="p-1 px-2 sm:px-3 border cursor-pointer text-white rounded bg-[#085E9C] text-xs sm:text-sm"
            onClick={() => setShowModal(true)}
          >
            استرداد
          </span>

          {/* زر الحذف */}
          <span
            className="text-black cursor-pointer hover:text-red-600"
            onClick={handleDelete}
            title="حذف العملية"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
        </div>
      </td>
    </tr>
  );
};

const Sales = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { payments, loading, error } = useSelector(
    (state: RootState) => state.payment
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getPayments(1));
  }, [dispatch]);

  const onPress = async (page) => {
    await dispatch(getPayments(page));
  };

  const paymentData = payments?.data || [];
  const hasPayments = paymentData.length > 0;

  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row p-4 bg-white items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
            <div className="text-lg sm:text-xl font-bold text-[#085E9C]">
              المبيعات
            </div>
            <div className="relative w-full sm:w-64 border rounded-md border-[#085E9C]">
              <input
                type="text"
                placeholder="بحث"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none text-sm"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-500" />
            </div>

            <CustomDropdown
              options={[
                { value: "", label: "الأحدث" },
                { value: "الجنسية", label: "الجنسية" },
                { value: "تاريخ الفاتورة", label: "تاريخ الفاتورة" },
                { value: "طريقة الدفع", label: "طريقة الدفع" },
                { value: "المبلغ", label: "المبلغ" },
              ]}
              selected={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] table-auto divide-y-2 divide-[#085E9C] bg-white text-sm">
            <thead className="text-center text-xs sm:text-sm">
              <tr className="px-2 sm:px-4 py-2 font-medium text-[#085E9C]">
                <th>ID</th>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>رقم الجوال</th>
                <th>الجنسية</th>
                <th>رقم الفاتورة</th>
                <th>رقم العملية</th>
                <th>تاريخ العملية</th>
                <th>طريقة الدفع</th>
                <th>نوع البطاقة</th>
                <th>آخر 4 أرقام</th>
                <th>المبلغ</th>
                <th>الضريبة</th>
                <th>الصافي</th>
                <th>الحالة</th>
                <th>إدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y text-center divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={16}>جاري التحميل...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={16} className="text-red-500">
                    {error}
                  </td>
                </tr>
              ) : hasPayments ? (
                paymentData.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    setShowModal={setShowModal}
                    dispatch={dispatch}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={16} className="px-4 py-2 text-gray-700">
                    لم يتم العثور على نتائج.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {payments?.meta?.last_page && (
        <Pagination pageCount={payments.meta.last_page} onPress={onPress} />
      )}

      <CustomModal isOpen={showModal}>
        <AddSales onClose={() => setShowModal(false)} />
      </CustomModal>
    </div>
  );
};

export default Sales;
