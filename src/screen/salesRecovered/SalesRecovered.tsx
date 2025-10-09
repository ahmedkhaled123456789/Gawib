import { useState, useEffect } from "react";
// import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import AddSalesRecovered from "./AddSalesRecovered";
import { getRefundedPayments } from "../../store/payment";
import { RootState } from "../../store";
import { AppDispatch } from "../../store";

const ProductRow = ({ product, index }) => {
  return (
    <tr key={product.id}>
      <td className="px-4 py-2 font-medium text-gray-900">{index + 1}</td>
      <td className="px-4 py-2 text-gray-700">
        <Link to={`/productDetails/${product.id}`}>
          <div className="w-24">{product.user_id}</div>
        </Link>
      </td>
      <td className="px-4 py-2 text-gray-700">
        {product.paytabs_response?.customer_details?.email || "N/A"}
      </td>
      <td className="px-4 py-2 text-gray-700">
        {product.paytabs_response?.customer_details?.phone || "N/A"}
      </td>
      <td className="px-4 py-2 text-gray-700">
        {product.paytabs_response?.customer_details?.country || "N/A"}
      </td>
      <td className="px-4 py-2 text-gray-700">
        <div className="w-24">{product.order_id}</div>
      </td>
      <td className="px-4 py-2 text-gray-700">
        <div className="w-24">
          {new Date(product.created_at).toLocaleDateString("ar-SA")}
        </div>
      </td>
      <td className="px-4 py-2 text-gray-700">
        <div className="w-24">{product.payment_method}</div>
      </td>
      <td className="px-4 py-2 text-gray-700">
        <div className="w-24">
          {product.amount} {product.currency}
        </div>
      </td>
      <td className="px-4 py-2 text-gray-700">
        <div className="w-24">
          {new Date(product.updated_at).toLocaleDateString("ar-SA")}
        </div>
      </td>
      <td className="px-4 py-2 text-gray-700">
        <div className="w-28">{product.transaction_ref}</div>
      </td>
    </tr>
  );
};

const SalesRecovered = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { refundedPayments, loading, error } = useSelector(
    (state: RootState) => state.payment
  );

  // @ts-ignore
  const [searchQuery, setSearchQuery] = useState("");
  // const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getRefundedPayments(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // فلترة البيانات بناءً على البحث
  const filteredProducts =
    refundedPayments?.data?.filter((product) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        product.order_id?.toLowerCase().includes(searchLower) ||
        product.transaction_ref?.toLowerCase().includes(searchLower) ||
        product.paytabs_response?.customer_details?.email
          ?.toLowerCase()
          .includes(searchLower) ||
        product.paytabs_response?.customer_details?.phone?.includes(
          searchQuery
        ) ||
        product.amount?.includes(searchQuery)
      );
    }) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-[#085E9C]">جاري تحميل البيانات...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-500">خطأ: {error}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
        {/* Header Controls */}
        <div className="flex p-4 bg-white md:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 items-center w-full md:w-auto">
            <div className="text-xl ml-16 font-bold text-[#085E9C]">
              المبيعات المستردة
            </div>
            {/* Search */}
            {/* <div className="relative w-full md:w-64 border rounded-md border-[#085E9C]">
              <input
                type="text"
                placeholder="بحث"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-500" />
            </div> */}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#085E9C] bg-white text-sm">
            <thead className="text-center">
              <tr className="px-4 py-2 font-medium text-[#085E9C]">
                <th className="px-4 w-auto py-2 font-medium">رقم</th>
                <th className="px-4 py-2 font-medium">رقم المستخدم</th>
                <th className="px-4 py-2 font-medium">البريد الإلكتروني</th>
                <th className="px-4 py-2 font-medium">رقم الجوال</th>
                <th className="px-4 py-2 font-medium">الجنسية</th>
                <th className="px-4 py-2 font-medium">رقم الفاتورة</th>
                <th className="px-4 py-2 font-medium">تاريخ الفاتورة</th>
                <th className="px-4 py-2 font-medium">طريقة الدفع</th>
                <th className="px-4 py-2 font-medium">المبلغ المسترد</th>
                <th className="px-4 py-2 font-medium">تاريخ الاسترداد</th>
                <th className="px-4 py-2 font-medium">رقم عملية الاسترداد</th>
              </tr>
            </thead>

            <tbody className="divide-y text-center divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    index={index}
                    // setShowModal={setShowModal}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-8 text-gray-700 text-center"
                  >
                    {searchQuery
                      ? "لم يتم العثور على نتائج للبحث"
                      : "لا توجد مبيعات مستردة"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination - بدون currentPage */}
      {refundedPayments?.meta && (
        <Pagination
          pageCount={refundedPayments.meta.last_page}
          onPress={handlePageChange}
        />
      )}

      <CustomModal isOpen={showModal}>
        <AddSalesRecovered onClose={() => setShowModal(false)} />
      </CustomModal>
    </div>
  );
};

export default SalesRecovered;
