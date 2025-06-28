import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import AddQuestion from "./AddQuestion";
 
const dummyProducts = [
  {
    _id: "1",
    name: " دول وعوصم      ",
    question: "ماهي الدولة التي ليست لها حدود بحرية وتعتبر دولة حبيسة  بين أكثر من 25 دولة ومنها أوزباكستان وطاجيكستان والتي لا تستطيع الوصول الى البحار الا عبر حدود برية",
    answer: "  ماهي الدولة التي ليست لها حدود بحرية وتعتبر دولة حبيسة  بين أكثر من 25 دولة ومنها أوزباكستان وطاجيكستان  ",
    count: 200,
   see: "سنوات 2",
   admin: "محمد الناصر",
 
    status: "نشط",
  },
  {
    _id: "2",
    name: " دول وعوصم      ",
    question: "ماهي الدولة التي ليست لها حدود بحرية وتعتبر دولة حبيسة  بين أكثر من 25 دولة ومنها أوزباكستان وطاجيكستان والتي لا تستطيع الوصول الى البحار الا عبر حدود برية",
    answer: "  ماهي الدولة التي ليست لها حدود بحرية وتعتبر دولة حبيسة  بين أكثر من 25 دولة ومنها أوزباكستان وطاجيكستان  ",
    count: 400,
   see: "سنوات 2",
   admin: "محمد الناصر",
 
    status: "نشط",
  },
  {
    _id: "3",
    name: " دول وعوصم      ",
    question: "ماهي الدولة التي ليست لها حدود بحرية وتعتبر دولة حبيسة  بين أكثر من 25 دولة ومنها أوزباكستان وطاجيكستان والتي لا تستطيع الوصول الى البحار الا عبر حدود برية",
    answer: "  ماهي الدولة التي ليست لها حدود بحرية وتعتبر دولة حبيسة  بين أكثر من 25 دولة ومنها أوزباكستان وطاجيكستان  ",
    count: 600,
   see: " -",
   admin: "محمد الناصر",
 
    status: "نشط",
  },
  
  

 ];

const ProductRow = ({ product, index ,setShowPriceModal}) => {
    
  return (
    <tr key={product._id}>
      <td className="px-4 py-2 font-medium text-gray-900">{index + 1}</td>
      <td className="px-4 py-2 text-gray-700">
        <Link to={`/productDetails/${product._id}`}><div className="w-20">{product.name}</div></Link>
      </td>
      <td className="px-4 py-2 text-gray-700"><div className="w-72">{product.question}</div></td>
      <td className="px-4 py-2 text-gray-700"><div className="w-72">{product.answer}</div></td>
      <td className="px-4 py-2 text-white"><div className={`w-16 px-4 py-1 rounded ${
    product.count === 200
      ? "bg-[#309222]"
      : product.count === 400
      ? "bg-[#9647c4]"
      : "bg-[#ae1113]"
  }`}>
        
        {product.count}</div></td>
      <td className="px-4 py-2 text-gray-700"><div className="w-20">{product.see}</div></td>
            <td className="px-4 py-2 text-gray-700"><div className="w-20">{product.admin}</div></td>
  
         <td className="px-4 py-2">
            <div className="flex  items-center justify-center w-40 gap-2">
                <span className="p-1 border cursor-pointer rounded bg-[#0765AA]"
                 onClick={() => setShowPriceModal(true)}>
                <img src="/images/group/edit.png" alt="" className="w-5 h-5" />
            </span>
                             <span className="p-1 border cursor-pointer rounded bg-[#0765AA]" 
                             onClick={() => setShowPriceModal(true)}
                             >
                <img src="/images/group/see.png" alt="" className="w-5 h-5" />
            </span>
                    <span className=" text-[#0765AA] border border-[#0765AA] rounded px-3 py-1 ">اعتماد</span>

            </div>
      </td>
    </tr>
  );
};

const Questions = () => {
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
          <div className="text-md  font-bold text-[#0765AA]">الأسئلة المعتمدة    </div>
 {/* Search */}
          <div className="relative w-full md:w-48 border rounded-md  border-[#0765AA]">
            <input
              type="text"
              placeholder="بحث"
              value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-8 pr-4 border border-gray-300 rounded-md  focus:outline-none  "
            />
            <FiSearch className="absolute left-3 top-3 text-gray-500" />
          </div>

          {/* Dropdown */}
        <CustomDropdown
  options={[
    { value: "", label: "الأحدث  " },
    { value: "الفئة", label: "الفئة" },
    { value: "  المشرف  ", label: " المشرف  " },
        

  ]}
  selected={statusFilter}
  onChange={setStatusFilter}
/>
    </div>
    <div className="flex items-center gap-2 ">
      <span className="text-[#ffc629] font-bold   border bg-[#0765AA] border-[#0765AA] rounded px-4 py-2 " >200</span>
      <span className="text-[#ffc629]  font-bold border border-[#0765AA]  rounded px-4 py-2 ">400</span>
      <span className="text-[#ffc629]  font-bold border border-[#0765AA] rounded px-4 py-2 ">600</span>
      <span className="text-[#0765AA] flex gap-1 border border-[#0765AA] rounded p-2 ">
        <span className=" border border-[#0765AA] rounded px-3  "></span>
        <span className=" text-[#0765AA] border border-[#0765AA] rounded px-3  ">اعتماد</span>
      </span>

    </div>
      <div className="flex items-center  space-x-4 space-x-reverse">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-[#0765AA] border border-[#0765AA] px-4 py-2 rounded text-sm font-medium transition-colors"
               onClick={() => setShowPriceModal(true)}
              >
إضافة سؤال           </button>
            </div>
      </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#0765AA] bg-white text-sm">
            <thead className="text-center">
              <tr className="px-4 py-2 font-medium text-[#0765AA]">
                <th className="px-4 w-auto py-2 font-medium">رقم</th>
           
                <th className="px-4 py-2 font-medium">  أسم الفئة    </th>
                 <th className="px-4 py-2 font-medium">السؤال    </th>
                <th className="px-4 py-2 font-medium">  الجواب    </th>
                <th className="px-4 py-2 font-medium">  النقاط      </th>
                <th className="px-4 py-2 font-medium">التلميح      </th>
                 <th className="px-4 py-2 font-medium">  مشرف الفئة      </th>

                <th className="px-4 py-2 font-medium">إدارة  </th>
              
              </tr>
            </thead>

            <tbody className="divide-y text-center divide-gray-200">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <ProductRow key={product._id} product={product} index={index}   setShowPriceModal={setShowPriceModal} />
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
        <AddQuestion onClose={() => setShowPriceModal(false)} />
      </CustomModal>

      <CustomModal isOpen={showModal}>
         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-6 shadow-lg w-full max-w-md border border-blue-300">
       
        <p className="text-center mb-6">  هل تريد حذف كود الخصم  </p>
        <div className="flex justify-center gap-4">
             <button
            onClick={() => setShowModal(false)}
            className={`px-4 py-2 text-white rounded bg-[#ff426e]`}
          >
            حذف
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-50"
          >
            إغلاق
          </button>
         
        </div>
      </div>
    </div>
      </CustomModal>
      
    </div>
  );
};

export default Questions;




























