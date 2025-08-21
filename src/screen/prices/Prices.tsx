import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
 import AddPrice from "./AddPrice";
import CustomModal from "../../components/Modals/CustomModal";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { getGamePackages } from "../../store/GamePackagesSlice";

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
      <td className="px-4 py-2 text-gray-700">{product.games_count}</td>
      <td className="px-4 py-2 text-gray-700">{product.price}</td>
      <td className="px-4 py-2 text-gray-700">{product.number_of_buys||"_"}</td>
      <td className="px-4 py-2 text-gray-700">{product.price}</td>
         <td className="px-4 py-2">
            <div className="flex  items-center justify-center gap-2">
                <span className="p-1 border cursor-pointer rounded bg-[#085E9C]">
                <img src="/images/group/edit.png" alt="" className="w-5 h-5" />
            </span>
                             <span className="p-1 border cursor-pointer rounded border-[#085E9C]" >

                 <img src="/images/group/true.png" alt="" className={`w-5 h-5 ${product.is_active ? 'opacity-100' : 'opacity-0'}`} />
            
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

const dispatch = useDispatch<AppDispatch>();

  const { gamePackages,loading ,error} = useSelector((state: RootState) => state.gamePackage);
 

      
  useEffect(() => {
    dispatch(getGamePackages());
  }, [dispatch]);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>حدث خطأ: {error}</div>;

  const filteredProducts = gamePackages?.data?.data?.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
       

 
 {/* Header Controls */}
    {/* Header */}
     
<div className="flex  p-4  bg-white md:flex-row items-center justify-between gap-4 ">
    <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="text-xl ml-16 font-bold text-[#085E9C]">باقات الأسعار</div>
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
    { value: "عدد مرات الشراء ", label: "عدد مرات الشراء " },
    { value: "  مبلغ الشراء  ", label: " مبلغ الشراء  " },
        

  ]}
  selected={statusFilter}
  onChange={setStatusFilter}
/>
    </div>
      <div className="flex items-center space-x-4 space-x-reverse">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-[#085E9C] border border-[#085E9C] px-4 py-2 rounded text-sm font-medium transition-colors"
               onClick={() => setShowPriceModal(true)}
              >
                إضافة باقة   
              </button>
            </div>
      </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#085E9C] bg-white text-sm">
            <thead className="text-center">
              <tr className="px-4 py-2 font-medium text-[#085E9C]">
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
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductRow key={product._id} product={product} index={index} />
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




























