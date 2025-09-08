import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store"; 
 
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import AddSales from "./AddSales";
import { getPayments } from "../../store/payment";

const ProductRow = ({ product, index , setShowModal}) => {
    
  return (
    <tr key={product._id}>
      <td className="px-4 py-2 font-medium text-gray-900">{index + 1}</td>
      <td className="px-4 py-2 text-gray-700">
        <Link to={`/productDetails/${product.id}`}>
     <div className="w-24"> {product.user.first_name} { product.user.last_name}</div>  
        </Link>
      </td>
      <td className="px-4 py-2 text-gray-700">    {product.user.email}</td>
      <td className="px-4 py-2 text-gray-700">   {product.user.phone_number }</td>
      <td className="px-4 py-2 text-gray-700">  {product.user.nationality || "_"}</td>
      <td className="px-4 py-2 text-gray-700"> <div className="w-24">{product.order_id}</div>  </td>
       <td className="px-4 py-2 text-gray-700">  {product.created_at || "_"}</td>
      <td className="px-4 py-2 text-gray-700"> <div className="w-24">{product.payment_method}</div>  </td>
      <td className="px-4 py-2 text-gray-700"><div className="w-24">{product.package.total_purchases_amount}</div>  </td>
            <td className="px-4 py-2 text-gray-700"> {product.amount} </td>

      <td className="px-4 py-2 text-gray-700"><div className="w-24">{product.package.price}</div>  </td>
         <td className="px-4 py-2">
            <div className="flex  items-center justify-center w-28 gap-2">
                <span className="p-1 border cursor-pointer rounded bg-[#085E9C]">
                <img src="/images/group/print.png" alt="" className="w-5 h-5" />
            </span>
                             <span className="p-1 px-3 border cursor-pointer text-white rounded bg-[#085E9C]" 
                             onClick={() => setShowModal(true)}
                             >

استرداد            
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
   
   await dispatch(getPayments(page))
 }

  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
        {/* Header */}
        <div className="flex p-4 bg-white md:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 items-center w-full md:w-auto">
            <div className="text-xl ml-16 font-bold text-[#085E9C]">
              المبيعات
            </div>
            {/* Search */}
            <div className="relative w-full md:w-64 border rounded-md border-[#085E9C]">
              <input
                type="text"
                placeholder="بحث"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-500" />
            </div>

            {/* Dropdown */}
            <CustomDropdown
              options={[
                { value: "", label: "الأحدث" },
                { value: "الجنسية", label: "الجنسية" },
                { value: "تاريخ الفاتورة", label: "تاريخ الفاتورة" },
                { value: "طريقة الدفع", label: "طريقة الدفع" },
                { value: "صافي المبلغ", label: "صافي المبلغ" },
              ]}
              selected={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#085E9C] bg-white text-sm">
            <thead className="text-center">
              <tr className="px-4 py-2 font-medium text-[#085E9C]">
                <th>رقم</th>
                <th>الأسم</th>
                <th>البريد الإلكتروني</th>
                <th>رقم الجوال</th>
                <th>الجنسية</th>
                <th>رقم الفاتورة</th>
                <th>تاريخ الفاتورة</th>
                <th>طريقة الدفع</th>
                <th>المبلغ المدفوع</th>
                <th>الضريبة</th>
                <th>صافي المبلغ</th>
                <th>إدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y text-center divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={12}>جاري التحميل...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={12} className="text-red-500">
                    {error}
                  </td>
                </tr>
              ) : payments?.data?.data.length > 0 ? (
                payments?.data?.data.map((product, index) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    index={index}
                    setShowModal={setShowModal}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="px-4 py-2 text-gray-700">
                    لم يتم العثور على نتائج.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
{
        payments?.data?.last_page && (
          <Pagination pageCount={payments?.data?.last_page} onPress={onPress} />
        )
      }

      {/* Modal */}
      <CustomModal isOpen={showModal}>
        <AddSales onClose={() => setShowModal(false)} />
      </CustomModal>
    </div>
  );
};

export default Sales;






















