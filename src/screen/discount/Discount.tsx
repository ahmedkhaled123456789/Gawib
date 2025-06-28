import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import AddDiscount from "./AddDiscount";

const dummyProducts = [
  {
    _id: "1",
    code: " باقة لعبة واحدة  ",
    Package: "ABC",
    nowPrice:20,
    price: "باقة 3 العاب",
    codePrice: 200,
     startDate: "29/08/2025",
     endDate: "29/08/2025",
     codeType: "عام",
    status: "نشط",
  },
  {
    _id: "2",
    code: " باقة لعبة واحدة  ",
    Package: "ABC",
    nowPrice:20,
    price: "باقة 3 العاب",
    codePrice: 200,
     startDate: "29/08/2025",
     endDate: "29/08/2025",
     codeType: "خاص",
    status: "محذوف",
  },
  {
    _id: "3",
    code: " باقة لعبة واحدة  ",
    Package: "ABC",
    nowPrice:20,
    price: "باقة 3 العاب",
    codePrice: 200,
     startDate: "29/08/2025",
     endDate: "29/08/2025",
     codeType: "عام",
    status: "منتهي",
  },

 ];

const ProductRow = ({ product, index ,setShowModal}) => {
    
  return (
    <tr key={product._id}>
      <td className="px-4 py-2 font-medium text-gray-900">{index + 1}</td>
      <td className="px-4 py-2 text-gray-700">
        <Link to={`/productDetails/${product._id}`}><div className="w-32">{product.code}</div> </Link>
      </td>
      <td className="px-4 py-2 text-gray-700"><div className="w-32">{product.Package}</div></td>
      <td className="px-4 py-2 text-gray-700"><div className="w-32">{product.price}</div></td>
            <td className="px-4 py-2 text-gray-700">
           <div className="w-32"> {product.nowPrice}%</div>  </td>

      <td className="px-4 py-2 text-gray-700"><div className="w-32"></div>{product.codePrice}</td>
      <td className="px-4 py-2 text-gray-700"><div className="w-32"></div>{product.startDate}</td>
            <td className="px-4 py-2 text-gray-700"><div className="w-32">{product.endDate}</div></td>
  
      
       <td className="px-4 py-2 text-gray-700"><div className="w-32">{product.codeType}</div></td>
<td
  className={`px-4 py-2 ${
    product.status === "نشط"
      ? "text-[#588A17]"
      : product.status === "منتهي"
      ? "text-[#7e7e7e]"
      : "text-[#ff426e]"
  }`}
>
 <div className="w-32">{product.status}</div> 
</td>      

         <td className="px-4 py-2">
            <div className="flex w-32  items-center justify-center gap-2">
                <span className="p-1 border cursor-pointer rounded bg-[#0765AA]">
                <img src="/images/group/edit.png" alt="" className="w-5 h-5" />
            </span>
                             <span className="p-1 border cursor-pointer rounded bg-[#0765AA]" 
                             onClick={() => setShowModal(true)}
                             >
                <img src="/images/group/delete.png" alt="" className="w-5 h-5" />
            </span>
            </div>
      </td>
    </tr>
  );
};

const Discount = () => {
  const [products] = useState(dummyProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
      const [showPriceModal, setShowPriceModal] = useState(false);
      const [showModal, setShowModal] = useState(false);

  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
       

 
 {/* Header Controls */}
    {/* Header */}
     
<div className="flex  p-4  bg-white md:flex-row items-center justify-between gap-4 ">
    <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="text-xl ml-16 font-bold text-[#0765AA]">كود خصم  </div>
 {/* Search */}
          <div className="relative w-full md:w-48 border rounded-md  border-[#0765AA]">
            <input
              type="text"
              placeholder="بحث"
              value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md  focus:outline-none  "
            />
            <FiSearch className="absolute left-3 top-3 text-gray-500" />
          </div>

          {/* Dropdown */}
        <CustomDropdown
   options={[
    { value: "", label: "الأحدث  " },
    { value: "تاريخ البداية", label: "تاريخ البداية" },
   

  ]}
  selected={statusFilter}
  onChange={setStatusFilter}
/>
    </div>
    <div className="flex items-center gap-2 ">
      <span className="text-[#588A17]   border border-[#0765AA] bg-[#d5d5d5] rounded px-4 py-1 " >نشط</span>
      <span className="text-[#7e7e7e] border border-[#0765AA] bg-[#d5d5d5] rounded px-4 py-1 ">منتهي</span>
      <span className="text-[#ff426e] border border-[#0765AA] rounded px-4 py-1 ">محذوف</span>
    </div>
      <div className="flex items-center space-x-4 space-x-reverse">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-[#0765AA] border border-[#0765AA] px-4 py-1 rounded text-sm font-medium transition-colors"
               onClick={() => setShowPriceModal(true)}
              >
إضافة كود خصم              </button>
            </div>
      </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#0765AA] bg-white text-sm">
            <thead className="text-center">
              <tr className="px-4 py-2 font-medium text-[#0765AA]">
                <th className="px-4 w-auto py-2 font-medium">رقم</th>
           
                <th className="px-4 py-2 font-medium">كود الخصم    </th>
                 <th className="px-4 py-2 font-medium">الباقة    </th>
                <th className="px-4 py-2 font-medium">السعر الحالي    </th>
                <th className="px-4 py-2 font-medium">السعر الحالي    </th>
                <th className="px-4 py-2 font-medium">سعر كود الخصم    </th>
                <th className="px-4 py-2 font-medium">تاريخ البداية    </th>
                <th className="px-4 py-2 font-medium">تاريخ النهاية    </th>
                <th className="px-4 py-2 font-medium">نوع كود الخصم    </th>
                <th className="px-4 py-2 font-medium">حالة كود الخصم    </th>

                <th className="px-4 py-2 font-medium">إدارة  </th>
              
              </tr>
            </thead>

            <tbody className="divide-y text-center divide-gray-200">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <ProductRow key={product._id} product={product} index={index}   setShowModal={setShowModal} />
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
        <AddDiscount onClose={() => setShowPriceModal(false)} />
      </CustomModal>

      <CustomModal isOpen={showModal}>
         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-6 shadow-lg w-full max-w-md border border-blue-300">
       
        <p className="text-center mb-6">  هل تريد حذف كود الخصم  </p>
        <div className="flex justify-center gap-4">
             <button
            onClick={() => setShowModal(false)}
            className={`px-8 py-2 text-white rounded bg-[#588A17] `}
          >
            نعم
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="px-8 py-2 text-white  bg-[#ff426e] rounded "
          >
            لا
          </button>
         
        </div>
      </div>
    </div>
      </CustomModal>
      
    </div>
  );
};

export default Discount;




























