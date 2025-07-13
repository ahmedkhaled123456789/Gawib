import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
 import CustomModal from "../../components/Modals/CustomModal";
import AddSalesRecovered from "./AddSalesRecovered";

const dummyProducts = [
  {
    _id: "1",
    name: " باقة لعبة واحدة  ",
    email:"Alihusssain@hotmail.com",
    phone: "966505963256",
    nationality: "السعودية",
    num: 10,
    Date: "27/08/2025",
    pay: "ماستر كارد",    
    subtotal: 55,
     price: 20,
    total: "27/08/2025",
     amount: "EW12531586456436",

   
  },
   {
    _id: "2",
    name: " باقة لعبة واحدة  ",
    email:"Alihusssain@hotmail.com",
    phone: "966505963256",
    nationality: "السعودية",
    num: 10,
    Date: "27/08/2025",
    pay: "ماستر كارد",    
    subtotal: 55,
     price: 20,
     total: "27/08/2025",
     amount: "EW12531586456436",

   
  },
   {
    _id: "3",
    name: " باقة لعبة واحدة  ",
    email:"Alihusssain@hotmail.com",
    phone: "966505963256",
    nationality: "السعودية",
    num: 10,
    Date: "27/08/2025",
    pay: "ماستر كارد",    
    subtotal: 55,
     price: 20,
    total: "27/08/2025",
     amount: "EW12531586456436",
 
   
  },

 ];

const ProductRow = ({ product, index , setShowModal}) => {
    
  return (
    <tr key={product._id}>
      <td className="px-4 py-2 font-medium text-gray-900">{index + 1}</td>
      <td className="px-4 py-2 text-gray-700">
        <Link to={`/productDetails/${product._id}`}>
     <div className="w-24"> {product.name}</div>  
        </Link>
      </td>
      <td className="px-4 py-2 text-gray-700">    {product.email}</td>
      <td className="px-4 py-2 text-gray-700">   {product.phone}</td>
      <td className="px-4 py-2 text-gray-700">  {product.nationality}</td>
      <td className="px-4 py-2 text-gray-700"> <div className="w-24">{product.num}</div>  </td>
       <td className="px-4 py-2 text-gray-700"> <div className="w-24">{product.Date}</div> </td>
      <td className="px-4 py-2 text-gray-700"> <div className="w-24">{product.pay}</div>  </td>
      <td className="px-4 py-2 text-gray-700"><div className="w-24">{product.subtotal}</div>  </td>
            <td className="px-4 py-2 text-gray-700"> <div className="w-24">{product.total}</div> </td>

      <td className="px-4 py-2 text-gray-700"><div className="w-28">{product.amount}</div>  </td>
         <td className="px-4 py-2">
            <div className="flex  items-center justify-center w-28 gap-2" onClick={() => setShowModal(true)}>
                <span className="p-1 border cursor-pointer rounded bg-[#085E9C]">
                <img src="/images/group/edit.png" alt="" className="w-5 h-5" />
            </span>
                            
            </div>
      </td>
    </tr>
  );
};

const SalesRecovered = () => {
  const [products] = useState(dummyProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
      const [showModal, setShowModal] = useState(false);


  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
       

 
 {/* Header Controls */}
      
<div className="flex  p-4  bg-white md:flex-row items-center justify-between gap-4 ">
    <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="text-xl ml-16 font-bold text-[#085E9C]">المبيعات المستردة
  </div>
 {/* Search */}
          <div className="relative w-full md:w-64 border rounded-md  border-[#085E9C]">
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
    { value: "الجنسية", label: "الجنسية" },
    { value: " تاريخ الفاتورة  ", label: " تاريخ الفاتورة  " },
        { value: " طريقة الدفع  ", label: " طريقة الدفع  " },
    { value: " تاريخ ا لاسترداد", label: " تاريخ ا لاسترداد" },
 
  ]}
  selected={statusFilter}
  onChange={setStatusFilter}
/>
    </div>
       
      </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#085E9C] bg-white text-sm">
            <thead className="text-center">
              <tr className="px-4 py-2 font-medium text-[#085E9C]">
                <th className="px-4 w-auto py-2 font-medium">رقم</th>
                <th className="px-4 py-2  font-medium">الأسم    </th>
                <th className="px-4 py-2 font-medium">البريد الإلكتروني    </th>
                <th className="px-4 py-2 font-medium">رقم الجوال    </th>
                <th className="px-4 py-2 font-medium">الجنسية    </th>
                <th className="px-4 py-2 font-medium">رقم الفاتورة    </th>
                <th className="px-4 py-2 font-medium">تاريخ الفاتورة  </th>
                <th className="px-4 py-2 font-medium">طريقة الدفع    </th>
                <th className="px-4 py-2 font-medium"> المبلغ المسترد      </th>
                <th className="px-4 py-2 font-medium">تاريخ الاسترداد    </th>
                <th className="px-4 py-2 font-medium">رقم عملية الاسترداد      </th>
                <th className="px-4 py-2 font-medium">إدارة    </th>

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
<CustomModal isOpen={showModal}>
        <AddSalesRecovered onClose={() => setShowModal(false)} />
      </CustomModal>
    </div>
  );
};

export default SalesRecovered;




























