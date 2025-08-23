import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import AddQuestion from "../questions/AddQuestion";
import { getGameFree, getGames } from "../../store/gameSlice";
 
 


const ProductRow = ({ product, index }) => {
    
  return (
    <tr key={product.id}>
      <td className="px-4 py-2 font-medium text-gray-900">{index + 1}</td>
      <td className="px-4 py-2 text-gray-700">
        <Link to={`/productDetails/${product._id}`}><div className="w-20">{product.name}</div></Link>
      </td>
      <td className="px-4 py-2 text-gray-700"><div className="w-72">{product.description}</div></td>
      <td className="px-4 py-2 text-gray-700"><div className="w-72">{product.description}</div></td>
      {/* <td className="px-4 py-2 text-white"><div className={`w-16 px-4 py-1 rounded ${
    product.points === 200
      ? "bg-[#309222]"
      : product.points === 400
      ? "bg-[#9647c4]"
      : "bg-[#ae1113]"
  }`}>
        
        {product.points}</div></td> */}
        <td className="px-4 py-2 text-gray-700"><div className="w-20">{ "سنوات 2"}</div></td>
            <td className="px-4 py-2 text-gray-700"><div className="w-20">{ "محمد الناصر"}</div></td>
              <td className="px-4 py-2 text-gray-700"><div className="w-20"></div>{product.admin.name}</td>

         <td className="px-4 py-2">
            <div className="flex  items-center justify-center w-24 gap-2">
               
                    <span className=" text-[#085E9C] border border-[#085E9C] rounded px-4 py-1 ">نشر</span>

            </div>
      </td>
    </tr>
  );
};

const Game = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
const dispatch = useDispatch<AppDispatch>();

  const { games} = useSelector((state: RootState) => state.game);

  useEffect(() => {
    dispatch(getGameFree());
  }, [dispatch]);  
  
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
          <div className="text-md  ml-16 font-bold text-[#085E9C]">اللعبة المجانية      </div>
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
    { value: "  المشرف  ", label: " المشرف  " },

  ]}
  selected={statusFilter}
  onChange={setStatusFilter}
/>
    </div>
     
      <div className="flex items-center  space-x-4 space-x-reverse">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-[#085E9C] border border-[#085E9C] px-4 py-2 rounded text-sm font-medium transition-colors"
               onClick={() => setShowPriceModal(true)}
              >
إضافة سؤال           </button>
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

                <th className="px-4 py-2 font-medium">إدارة  </th>
              
              </tr>
            </thead>

             <tbody className="divide-y text-center divide-gray-200">
  {games?.data?.length > 0 ? (
    games.data
      .filter(game => game?.is_free === true) 
      .map((game, index) => (
        <ProductRow
          key={game.id}
          product={game}
          index={index}
         />
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

export default Game;




























