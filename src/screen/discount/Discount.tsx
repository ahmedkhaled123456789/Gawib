import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import AddDiscount from "./AddDiscount";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { deleteDiscountCode, getDiscountCodes } from "../../store/DiscountSlice";



const ProductRow = ({ product,setSelectedId,setShowPriceModal, index ,setShowModal}) => {
    
  return (
    <tr key={product.id}>
      <td className="px-4 py-2 font-medium text-gray-900">{index + 1}</td>
      <td className="px-4 py-2 text-gray-700">
        <Link to={`/productDetails/${product._id}`}><div className="w-32">{product.code}</div> </Link>
      </td>
      <td className="px-4 py-2 text-gray-700"><div className="w-32">{product.game_package.name}</div></td>
      <td className="px-4 py-2 text-gray-700"><div className="w-32">{product.game_package.price}</div></td>
            {/* <td className="px-4 py-2 text-gray-700">
           <div className="w-32"> {product.nowPrice}%</div>  </td> */}

      <td className="px-4 py-2 text-gray-700"><div className="w-32"></div>{product.discounted_price}</td>
      <td className="px-4 py-2 text-gray-700"><div className="w-32"></div>{product.starts_at}</td>
            <td className="px-4 py-2 text-gray-700"><div className="w-32">{product.ends_at}</div></td>
  
      
       <td className="px-4 py-2 text-gray-700"><div className="w-32">{product.type ? "عام" : "خاص"}</div></td>
<td
  className={`px-4 py-2 ${
    product.status === "active"
      ? "text-[#588A17]"
      : product.status === "not active"
      ? "text-[#ff426e]"
      :  "text-[#7e7e7e]"
  }`}
>
 <div className="w-32">{product.status === "active" ? "نشط" : "منتهي"}</div> 
</td>      

         <td className="px-4 py-2">
            <div className="flex w-32  items-center justify-center gap-2">
                <span className="p-1 border cursor-pointer rounded bg-[#085E9C]"
                  
   onClick={() => {
    setSelectedId(product._id || product.id); 
    setShowPriceModal(true); 
  }}
                >
                <img src="/images/group/edit.png" alt="" className="w-5 h-5" />
            </span>
                             <span
  className="p-1 border cursor-pointer rounded bg-[#085E9C]" 
  onClick={() => {
    setSelectedId(product._id || product.id);   
    setShowModal(true); 
  }}
>
  <img src="/images/group/delete.png" alt="" className="w-5 h-5" />
</span>
            </div>
      </td>
    </tr>
  );
};

const Discount = () => {
const dispatch = useDispatch<AppDispatch>();

  const { discountCodes } = useSelector((state: RootState) => state.discountCodes);
 
useEffect(() => {
  dispatch(getDiscountCodes(1));
}, [dispatch]);
  // const [products] = useState(dummyProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
      const [showPriceModal, setShowPriceModal] = useState(false);
      const [showModal, setShowModal] = useState(false);
const [selectedId, setSelectedId] = useState(null);


const handleDelete = () => {
   if (selectedId) {

    dispatch(deleteDiscountCode(selectedId));
  }
  setShowModal(false);
};

const onPress = async (page) => { 
  
  await dispatch(getDiscountCodes(page))
}
  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
       

 
 {/* Header Controls */}
    {/* Header */}
     
<div className="flex  p-4  bg-white md:flex-row items-center justify-between gap-4 ">
    <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="text-xl ml-16 font-bold text-[#085E9C]">كود خصم  </div>
 {/* Search */}
          <div className="relative w-full md:w-48 border rounded-md  border-[#085E9C]">
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
      <span className="text-[#588A17]   border border-[#085E9C] bg-[#d5d5d5] rounded px-4 py-1 " >نشط</span>
      <span className="text-[#7e7e7e] border border-[#085E9C] bg-[#d5d5d5] rounded px-4 py-1 ">منتهي</span>
      <span className="text-[#ff426e] border border-[#085E9C] rounded px-4 py-1 ">محذوف</span>
    </div>
      <div className="flex items-center space-x-4 space-x-reverse">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-[#085E9C] border border-[#085E9C] px-4 py-1 rounded text-sm font-medium transition-colors"
               onClick={() => setShowPriceModal(true)}
              >
إضافة كود خصم              </button>
            </div>
      </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#085E9C] bg-white text-sm">
            <thead className="text-center">
              <tr className="px-4 py-2 font-medium text-[#085E9C]">
                <th className="px-4 w-auto py-2 font-medium">رقم</th>
           
                <th className="px-4 py-2 font-medium">كود الخصم    </th>
                 <th className="px-4 py-2 font-medium">الباقة    </th>
                <th className="px-4 py-2 font-medium">السعر الحالي    </th>
                {/* <th className="px-4 py-2 font-medium">السعر الحالي    </th> */}
                <th className="px-4 py-2 font-medium">سعر كود الخصم    </th>
                <th className="px-4 py-2 font-medium">تاريخ البداية    </th>
                <th className="px-4 py-2 font-medium">تاريخ النهاية    </th>
                <th className="px-4 py-2 font-medium">نوع كود الخصم    </th>
                <th className="px-4 py-2 font-medium">حالة كود الخصم    </th>

                <th className="px-4 py-2 font-medium">إدارة  </th>
              
              </tr>
            </thead>

            <tbody className="divide-y text-center divide-gray-200">
              {discountCodes?.data.length > 0 ? (
  discountCodes?.data.map((product, index) => (
    <ProductRow
      key={index}
      product={product}
      index={index}
      setShowModal={setShowModal}
      setSelectedId={setSelectedId}
      setShowPriceModal={setShowPriceModal}
    />
  ))
) : (
  <tr>
    <td colSpan={13} className="px-4 py-2 text-gray-700">
      لم يتم العثور على أكواد خصم.
    </td>
  </tr>
)}

            </tbody>
          </table>
        </div>
      </div>
{
discountCodes?.meta.last_page && (
          <Pagination pageCount={discountCodes?.meta.last_page} onPress={onPress} />
        )
      }
      <CustomModal isOpen={showPriceModal}>
        <AddDiscount  selectedId={selectedId} onClose={() => setShowPriceModal(false)} />
      </CustomModal>

      <CustomModal isOpen={showModal}>
         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-6 shadow-lg w-full max-w-md border border-blue-300">
       
        <p className="text-center mb-6">  هل تريد حذف كود الخصم  </p>
        <div className="flex justify-center gap-4">
             <button
  onClick={handleDelete}
  className="px-8 py-2 text-white rounded bg-[#588A17]"
>
  نعم
</button>
<button
  onClick={() => setShowModal(false)}
  className="px-8 py-2 text-white bg-[#ff426e] rounded"
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




























