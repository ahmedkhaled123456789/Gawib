import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
 import AddPrice from "./AddPrice";
import CustomModal from "../../components/Modals/CustomModal";

const dummyProducts = [
  {
    _id: "1",
    name: " باقة لعبة واحدة  ",
    amount: 3,
    count: 10,
    price: 20,
    total: 200,
    status: "نشط",

   
  },
{
    _id: "2",
    name: " باقة لعبة واحدة  ",
    amount: 3,
    count: 10,
    price: 20,
    total: 200,
    status: "نشط",

     

  },
  {
    _id: "3",
    name: " باقة لعبة واحدة  ",
    amount: 3,
    count: 10,
    price: 20,
    total: 200,
    status: "موقوف",

  },
 ];

const ProductRow = ({ product, index }) => {
    
  return (
    <tr key={product._id}>
      <td className="px-4 py-2 font-medium text-gray-900">{index + 1}</td>
      <td className="px-4 py-2 text-gray-700">
        <Link to={`/productDetails/${product._id}`}>{product.name}</Link>
      </td>
      <td className="px-4 py-2 text-gray-700">{product.count}</td>
      <td className="px-4 py-2 text-gray-700">{product.price}</td>
      <td className="px-4 py-2 text-gray-700">{product.amount}</td>
      <td className="px-4 py-2 text-gray-700">{product.total}</td>
         <td className="px-4 py-2">
            <div className="flex  items-center justify-center gap-2">
                <span className="p-1 border cursor-pointer rounded bg-[#0765AA]">
                <img src="/public/images/group/edit.png" alt="" className="w-5 h-5" />
            </span>
                             <span className="p-1 border cursor-pointer rounded border-[#0765AA]" >

                 <img src="/public/images/group/true.png" alt="" className={`w-5 h-5 ${product.status === 'نشط' ? 'opacity-100' : 'opacity-0'}`} />
            
             </span>
            </div>
      </td>
    </tr>
  );
};

const Prices = () => {
  const [products] = useState(dummyProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
      const [showPriceModal, setShowPriceModal] = useState(false);

  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
       

 
 {/* Header Controls */}
    {/* Header */}
     
<div className="flex  p-4  bg-white md:flex-row items-center justify-between gap-4 ">
    <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="text-xl ml-16 font-bold text-[#0765AA]">باقات الأسعار</div>
 {/* Search */}
          <div className="relative w-full md:w-64 border rounded-md  border-[#0765AA]">
            <input
              type="text"
              placeholder="بحث باسم المنتج..."
              value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md  focus:outline-none  "
            />
            <FiSearch className="absolute left-3 top-3 text-gray-500" />
          </div>

          {/* Dropdown */}
        <CustomDropdown
  options={[
    { value: "", label: "كل الحالات" },
    { value: "متاح", label: "متاح" },
    { value: "غير متاح", label: "غير متاح" },
  ]}
  selected={statusFilter}
  onChange={setStatusFilter}
/>
    </div>
      <div className="flex items-center space-x-4 space-x-reverse">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-[#0765AA] border border-[#0765AA] px-4 py-2 rounded text-sm font-medium transition-colors"
               onClick={() => setShowPriceModal(true)}
              >
                إضافة باقة   
              </button>
            </div>
      </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#0765AA] bg-white text-sm">
            <thead className="text-center">
              <tr className="px-4 py-2 font-medium text-[#0765AA]">
                <th className="px-4 w-auto py-2 font-medium">رقم</th>
                <th className="px-4 py-2  font-medium">أسم الباقة  </th>
                <th className="px-4 py-2 font-medium">عدد الألعاب  </th>
                <th className="px-4 py-2 font-medium">السعر    </th>
                <th className="px-4 py-2 font-medium">عدد مرات الشراء</th>
                <th className="px-4 py-2 font-medium">مبلغ الشراء  </th>
                <th className="px-4 py-2 font-medium">إدارة  </th>
              
              </tr>
            </thead>

            <tbody className="divide-y text-center divide-gray-200">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <ProductRow key={product._id} product={product} index={index}    />
                ))
              ) : (
                <tr>
                  <td colSpan={13} className="px-4 py-2 text-gray-700">
                    لم يتم العثور على منتجات.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
              <Pagination pageCount={6} onPress={1} />
<CustomModal isOpen={showPriceModal}>
        <AddPrice onClose={() => setShowPriceModal(false)} />
      </CustomModal>
    </div>
  );
};

export default Prices;




























