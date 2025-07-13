 import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import AddPosted_questions from "./AddPosted_questions";
   
const dummyProducts = [
  {
    _id: "1",
    name: " دول وعوصم      ",
    question: "ماهي الدولة التي ليست لها حدود بحرية وتعتبر دولة حبيسة  بين أكثر من 25 دولة ومنها أوزباكستان وطاجيكستان والتي لا تستطيع الوصول الى البحار الا عبر حدود برية",
    answer: "  ماهي الدولة التي ليست لها حدود بحرية وتعتبر دولة حبيسة  بين أكثر من 25 دولة ومنها أوزباكستان وطاجيكستان  ",
    count: 200,
   see: "سنوات 2",
   admin: "محمد الناصر",
      copy: "",

    status: "نشط",
    share:"نشر"

  },
  {
    _id: "2",
    name: " دول وعوصم      ",
    question: "ماهي الدولة التي ليست لها حدود بحرية وتعتبر دولة حبيسة  بين أكثر من 25 دولة ومنها أوزباكستان وطاجيكستان والتي لا تستطيع الوصول الى البحار الا عبر حدود برية",
    answer: "  ماهي الدولة التي ليست لها حدود بحرية وتعتبر دولة حبيسة  بين أكثر من 25 دولة ومنها أوزباكستان وطاجيكستان  ",
    count: 400,
   see: "سنوات 2",
   admin: "محمد الناصر",
 copy: "",
    status: "نشط",
        share:"منشور"

  },
  {
    _id: "3",
    name: " دول وعوصم      ",
    question: "ماهي الدولة التي ليست لها حدود بحرية وتعتبر دولة حبيسة  بين أكثر من 25 دولة ومنها أوزباكستان وطاجيكستان والتي لا تستطيع الوصول الى البحار الا عبر حدود برية",
    answer: "  ماهي الدولة التي ليست لها حدود بحرية وتعتبر دولة حبيسة  بين أكثر من 25 دولة ومنها أوزباكستان وطاجيكستان  ",
    count: 600,
   see: " -",
   admin: "محمد الناصر",
 copy: "(دول وعواصم) خرائط ، اعلام ، فن اجنبي",
    status: "نشط",
        share:"نشر"

  },
  
  

 ];

const ProductRow = ({ product, index ,setShowPriceModal,setShowSalesModal, setShowModal}) => {
    
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
                <span className="p-1 border cursor-pointer rounded bg-[#085E9C]" onClick={() => setShowModal(true)} >
                <img src="/images/group/see.png" alt="" className="w-5 h-5" />
            </span>
                             
 
            </div>
      </td>
            <td className="px-4 py-2 text-gray-700"><div className="w-32">{product.copy}</div></td>

         <td className="px-4 py-2">
            <div className="flex  items-center justify-center w-60 gap-2" >
                  <span className="p-1 border  cursor-pointer rounded bg-[#ffc629]"
                  onClick={() => setShowSalesModal(true)}
                  
                            
                             >
                <img src="/images/group/copy.png" alt="" className="w-5 h-5 " />
            </span>
             <span className="p-1 border cursor-pointer rounded border-[#085E9C]" >

                 <img src="/images/group/true.png" alt="" className={`w-5 h-5 ${product.status === 'نشط' ? 'opacity-100' : 'opacity-0'}`} />
            
             </span>
                <span className="p-1 border cursor-pointer rounded bg-[#085E9C]" onClick={() => setShowPriceModal(true)}>
                <img src="/images/group/edit.png" alt="" className="w-5 h-5" />
            </span>
                             <span className="p-1 border cursor-pointer rounded bg-[#085E9C]"
                             onClick={() => setShowPriceModal(true)} 
                              >
                <img src="/images/group/see.png" alt="" className="w-5 h-5" />
            </span>

                    <span className={`${product.share === 'نشر' ? 'text-[#085E9C] border  border-[#085E9C]' : 'text-[#fff]   bg-[#085E9C]'} flex items-center justify-center w-16 cursor-pointer rounded px-3 py-1`}>{product.share}</span>

            </div>
      </td>
    </tr>
  );
};

const Posted_questions = () => {
  const [products] = useState(dummyProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
      const [showPriceModal, setShowPriceModal] = useState(false);
      const [showModal, setShowModal] = useState(false);
            const [showSalesModal, setShowSalesModal] = useState(false);

  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
       

 
 {/* Header Controls */}
    {/* Header */}
     
<div className="flex  p-4  bg-white md:flex-row items-center  gap-4 ">
    <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="text-md w-32 font-bold text-[#085E9C]">الأسئلة المنشورة      </div>
 {/* Search */}
          <div className="relative w-full md:w-48 border rounded-md  border-[#085E9C]">
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
    { value: " المشرف  ", label: " المشرف  " },
        { value: " البلاغات  ", label: " البلاغات  " },
    { value: " المجانية", label: " المجانية" },
    { value: "  حالة الفئة  ", label: "  حالة الفئة  " },

  ]}
  selected={statusFilter}
  onChange={setStatusFilter}
/>
    </div>
    <div className="flex items-center gap-2 ">
      <span className="text-[#ffc629] font-bold   border bg-[#085E9C] border-[#085E9C] rounded px-4 py-2 " >200</span>
      <span className="text-[#ffc629]  font-bold border border-[#085E9C]  rounded px-4 py-2 ">400</span>
      <span className="text-[#ffc629]  font-bold border border-[#085E9C] rounded px-4 py-2 ">600</span>
      <span className="text-[#085E9C] flex gap-2 border border-[#085E9C] rounded p-2 ">
        <span className=" border border-[#085E9C] rounded px-3  "></span>
        <span className=" text-[#085E9C] text-center font-bold border border-[#085E9C] rounded px-6  ">نشر</span>
      </span>

    </div>
     
      </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#085E9C] bg-white text-sm">
            <thead className="text-center">
              <tr className="px-4 py-2 font-medium text-[#085E9C]">
                <th className="px-4 w-auto py-2 font-medium">رقم</th>
           
                <th className="px-4 py-2 font-medium">  أسم الفئة    </th>
                 <th className="px-4 py-2 font-medium">السؤال    </th>
                <th className="px-4 py-2 font-medium">  الجواب    </th>
                <th className="px-4 py-2 font-medium">  النقاط      </th>
                <th className="px-4 py-2 font-medium">التلميح      </th>
                 <th className="px-4 py-2 font-medium">  مشرف الفئة      </th>
                 <th className="px-4 py-2 font-medium">  البلاغات         </th>
                  <th className="px-4 py-2 font-medium">     نسخ إلى      </th>

                <th className="px-4 py-2 font-medium">إدارة  </th>
              
              </tr>
            </thead>

            <tbody className="divide-y text-center divide-gray-200">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <ProductRow key={product._id} product={product} setShowModal={setShowModal} index={index} setShowSalesModal={setShowSalesModal}   setShowPriceModal={setShowPriceModal} />
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
        <AddPosted_questions onClose={() => setShowPriceModal(false)} />
      </CustomModal>
<CustomModal isOpen={showSalesModal}>
         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-6 shadow-lg w-full max-w-md border border-blue-300">
      <form className="grid grid-cols-2 gap-4 text-right">
          {/* أول صف */}
          <button
            type="button"
            className="col-span-1 bg-gray-200 text-black font-bold py-2 rounded"
          >
            دول وعواصم
          </button>
          <button
            type="button"
            className="col-span-1 bg-gray-300 text-black font-bold py-2 rounded"
          >
            200
          </button>
          

          {/* ثاني صف */}
         
          <select className="col-span-1 border rounded py-2 px-2">
            <option>جميع الفئات</option>
          </select>
 <select className="col-span-1 border rounded py-2 px-2">
            <option>200</option>
          </select>
          {/* ثالث صف */}
         
          <button
            type="submit"
            className="col-span-1 bg-[#075985] text-white py-2 rounded font-bold hover:bg-blue-700"
          >
            نسخ
          </button>
           <button
            type="button"
            onClick={() => setShowSalesModal(false)}
            className="col-span-1 text-[#085E9C] border border-[#085E9C] py-2 rounded hover:bg-blue-100"
          >
            إلغاء وإغلاق
          </button>
        </form>
        
      </div>
    </div>
      </CustomModal>

      <CustomModal isOpen={showModal}>
         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-6 shadow-lg w-full max-w-md border border-[#085E9C]">
        <div className="text-center text-lg mb-6 w-full text-[#085E9C] font-medium rounded  border border-[#085E9C] px-20 py-10  ">
         في هذا السوال يوجد خطاء عاصمة <br /> مصر القاهرة وليس طرابلس
        </div>
      
        <p className="text-center text-lg font-medium mb-6"> هل تم تعديل الخطاء  </p>
        <div className="flex justify-center gap-2">
             <button
            onClick={() => setShowModal(false)}
            className={`px-10 py-1 text-white rounded bg-[#588a17]`}
          >
            نعم
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="px-10 py-1 text-white rounded bg-[#ff426e]"
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

export default Posted_questions;




























