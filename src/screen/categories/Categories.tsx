import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import AddCategories from "./AddCategories";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
 import { getGames } from "../../store/gameSlice";
 
const QuestionStats = ({ stats }) => {
  const colors = ['bg-[#309222]', 'bg-[#9647c4]', 'bg-[#ae1113]', 'bg-[#292d32]'];
     const colorsText = ['text-[#309222]', 'text-[#9647c4]', 'text-[#ae1113]', 'text-[#292d32]'];
  return (
    <div className="flex items-center justify-between   w-48">
       <div className="grid grid-cols-1 gap-1">
        <span  className={`px-2 py-1 rounded text-white font-bold ${colors[0]}`}>
          {stats.active_points_200}
        </span>
         <span  className={`px-2 py-1 rounded  font-bold ${colorsText[0]}`}>
          {stats.active_points_200}
        </span>
       </div>
        <div className="grid grid-cols-1 gap-1">
        <span  className={`px-2 py-1 rounded text-white font-bold ${colors[1]}`}>
          {stats.active_points_400}
        </span>
         <span  className={`px-2 py-1 rounded  font-bold ${colorsText[1]}`}>
          {stats.active_points_400}
        </span>
       </div>
        <div className="grid grid-cols-1 gap-1">
        <span  className={`px-2 py-1 rounded text-white font-bold ${colors[2]}`}>
          {stats.active_points_600}
        </span>
         <span  className={`px-2 py-1 rounded  font-bold ${colorsText[2]}`}>
          {stats.active_points_600}
        </span>
       </div>
        <div className="grid grid-cols-1 gap-1">
        <span  className={`px-2 py-1 rounded text-white font-bold ${colors[3]}`}>
          {stats.total|| 100}
        </span>
         <span  className={`px-2 py-1 rounded  font-bold ${colorsText[3]}`}>
          {stats.total|| 100}
        </span>
       </div>
    </div>
  );
};

const QuestionStatsNon = ({ stats }) => {
  const colors = ['bg-[#309222]', 'bg-[#9647c4]', 'bg-[#ae1113]', 'bg-[#292d32]'];
     const colorsText = ['text-[#309222]', 'text-[#9647c4]', 'text-[#ae1113]', 'text-[#292d32]'];
  return (
    <div className="flex items-center justify-between   w-48">
       <div className="grid grid-cols-1 gap-1">
        <span  className={`px-2 py-1 rounded text-white font-bold ${colors[0]}`}>
          {stats.non_active_points_200}
        </span>
         <span  className={`px-2 py-1 rounded  font-bold ${colorsText[0]}`}>
          {stats.non_active_points_200}
        </span>
       </div>
        <div className="grid grid-cols-1 gap-1">
        <span  className={`px-2 py-1 rounded text-white font-bold ${colors[1]}`}>
          {stats.non_active_points_400}
        </span>
         <span  className={`px-2 py-1 rounded  font-bold ${colorsText[1]}`}>
          {stats.non_active_points_400}
        </span>
       </div>
        <div className="grid grid-cols-1 gap-1">
        <span  className={`px-2 py-1 rounded text-white font-bold ${colors[2]}`}>
          {stats.non_active_points_600}
        </span>
         <span  className={`px-2 py-1 rounded  font-bold ${colorsText[2]}`}>
          {stats.non_active_points_600}
        </span>
       </div>
        <div className="grid grid-cols-1 gap-1">
        <span  className={`px-2 py-1 rounded text-white font-bold ${colors[3]}`}>
          {stats.total|| 100}
        </span>
         <span  className={`px-2 py-1 rounded  font-bold ${colorsText[3]}`}>
          {stats.total|| 100}
        </span>
       </div>
    </div>
  );
};
const CategoriesRow = ({ product,setSelectedImg,setSelectedId, index,setShowCatModal }) => {
   
  return (
    <tr key={product.id} className="text-center">
      <td className="px-4 py-2 font-medium text-gray-900">{index + 1}</td>
      <td className="px-4 py-2   text-gray-700">
        <div className="w-24"> {product.name}</div>
       </td>
      <td className="px-4 py-2  text-gray-700">
                <div className="w-24"> {product?.category?.name || "_"}</div>

       </td>

      <td className="px-4 py-2  text-gray-700">
                <div className="w-24"> {product.admin.name}</div>

       </td>
      <td className="px-4 py-2 text-gray-700">
        <QuestionStatsNon stats={product} />
      </td>
      <td className="px-4 py-2">
        <div className=" flex items-center justify-center">
<img
  src={product.image}
  alt={`${product?.category?.name} logo`}
  className="w-6 h-6 rounded-full cursor-pointer"
  onClick={() => setSelectedImg(product.img)}
/>
        </div>
      </td>
      <td className="px-4 py-2 text-gray-700">
        <QuestionStats stats={product} />
      </td>
      <td className="px-4 py-2 text-gray-700">
        <div className="w-24">
 {product.number_of_plays}
        </div>
       </td>
   <td className="px-4 py-2">
  <span
    className={`px-3 py-1 rounded font-bold ${
      product.is_active  ? "text-[#588a17]" : "text-[#db2777]"
    }`}
  >
    {product.is_active?"منشورة":"موقوفة"}
  </span>
</td>

      <td className="px-4 py-2">
        <button className=" py-2 w-24 bg-[#085e9c] text-white rounded cursor-pointer"
       onClick={() => {
    setSelectedId(product.id); 
    setShowCatModal(true); 
  }}>
           
          إضافة صورة
        </button>
        
      </td>
    </tr>
  );
};


const Categories = () => {
  const dispatch = useDispatch<AppDispatch>();
    const {games } = useSelector((state: RootState) => state.game);
    useEffect(() =>{
dispatch(getGames(1))
    },[])
    console.log(games)
   const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
    const [showCatModal, setShowCatModal] = useState(false);
const [selectedImg, setSelectedImg] = useState(null);
 const [selectedId, setSelectedId] = useState(null);
 const onPress = async (page) => { 
   
   await dispatch(getGames(page))
 }
  return (
    <div className="p-4">
 

 {/* Header Controls */}
      <div className="flex flex-col p-4  bg-white md:flex-row items-center justify-between gap-4 ">
    <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="text-xl ml-16 font-bold text-[#085E9C]">    الفئات</div>
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
    { value: " تاريخ التسجيل", label: " تاريخ التسجيل" },
        { value: " عدد الألعاب", label: " عدد الألعاب" },
    { value: " المشتريات", label: " المشتريات" },
    { value: "  حالة الحساب", label: "  حالة الحساب" },

  ]}
  selected={statusFilter}
  onChange={setStatusFilter}
/>
    </div>
      
      </div>
        <div className="overflow-auto">
          <table className="min-w-full  divide-y-2 divide-[#085E9C] bg-white text-sm">
             <thead className="text-center">
              <tr className="px-4 py-2  text-sm text-[#085E9C]">
                <th className="px-4 w-auto py-2 font-medium">رقم</th>
                <th className="px-4 py-2  font-medium">أسم المجموعة   </th>
                <th className="px-4 py-2 font-medium">أسم الفئة  </th>
                <th className="px-4 py-2 font-medium">مشرف  الفئة    </th>
                <th className="px-4 py-2 font-medium"> 

<div className="mb-2">ألأسئلة المعتمدة</div>
<div className="flex items-center justify-between ">
  <span>200</span>
  <span>400</span>
  <span>600</span>
  <span>الكل</span>
</div>
                </th>
                <th className="px-4 py-2 font-medium"> صورة الفئة    </th>

                <th className="px-4 py-2 font-medium">   
                  <div className="mb-2">ألأسئلة المنشورة</div>
<div className="flex items-center justify-between ">
  <span>200</span>
  <span>400</span>
  <span>600</span>
  <span>الكل</span>
</div>
                   </th>
                <th className="px-4 py-2 font-medium">مستخدمي  الفئة  
                   </th>
                <th className="px-4 py-2 font-medium">حالة الفئة      </th>
                <th className="px-4 py-2 font-medium"> إدارة    </th>
               
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {games?.data.length > 0 ? (
              games?.data.map((product, index) => (
                <CategoriesRow  setSelectedId={setSelectedId} key={product._id} setSelectedImg={setSelectedImg} product={product}  setShowCatModal={setShowCatModal} index={index} />
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-gray-500">
                  لم يتم العثور على نتائج.
                </td>
              </tr>
            )}
          </tbody>
          </table>
          <CustomModal isOpen={showCatModal}>
        <AddCategories selectedId={selectedId} onClose={() => setShowCatModal(false)} />
      </CustomModal>



      {selectedImg && (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    onClick={() => setSelectedImg(null)} 
  >
    <img
      src={selectedImg}
      alt="عرض الصورة"
      className="max-w-full  max-h-full rounded shadow-lg"
      onClick={e => e.stopPropagation()} 
    />
  </div>
)}

        </div>
               {
       games?.meta?.last_page && (
          <Pagination pageCount={games?.meta?.last_page} onPress={onPress} />
        )
      }

    </div>
  );
};

export default Categories;











// import { useEffect, useMemo, useState } from "react";
// import { FiSearch } from "react-icons/fi";
// import CustomDropdown from "../../components/CustomDropdown";
// import Pagination from "../../components/pagination/Pagination";
// import CustomModal from "../../components/Modals/CustomModal";
// import AddCategories from "./AddCategories";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../store";
//  import { getGames } from "../../store/gameSlice";
 
// const data = [
//   {
//     _id: "1",
//     groupName: "جغرافيا والعالم",
//     categoryName: "دول وعواصم",
//     supervisor: "علي محمد",
//     approvedQuestions: { total: 4164, q600: 4164, q400: 694, q200: 694 },
//     publishedQuestions: { total: 4164, q600: 4164, q400: 694, q200: 694 },
//     users: 30,
//     status:"موقوفة",
//     img:"/images/group/see.png"
//   },
//   {
//     _id: "2",
//     groupName: "الفنون",
//     categoryName: "فن أجنبي",
//     supervisor: "علي محمد",
//     approvedQuestions: { total: 4164, q600: 4164, q400: 694, q200: 694 },
//     publishedQuestions: { total: 4164, q600: 4164, q400: 694, q200: 694 },
//     users: 1500,
//     status:"منشورة",
//     img:"/images/group/see.png"
//   },
//   {
//     _id: "3",
//     groupName: "ذكاء",
//     categoryName: "فهم الصورة",
//     supervisor: "علي محمد",
//     approvedQuestions: { total: 4164, q600: 4164, q400: 694, q200: 694 },
//     publishedQuestions: { total: 4164, q600: 4164, q400: 694, q200: 694 },
//     users: 200,
//     status:"منشورة",
//     img:"/images/group/see.png"
//   },
// ];
// const QuestionStats = ({ stats }) => {
//   const colors = ['bg-[#309222]', 'bg-[#9647c4]', 'bg-[#ae1113]', 'bg-[#292d32]'];
//   const keys = ['total', 'q600', 'q400', 'q200'];
//     const colorsText = ['text-[#309222]', 'text-[#9647c4]', 'text-[#ae1113]', 'text-[#292d32]'];


//   return (
//     <div className="flex items-center justify-between   w-48">
//       {keys.map((key, i) => (
//        <div className="grid grid-cols-1 gap-1">
//         <span key={key} className={`px-2 py-1 rounded text-white font-bold ${colors[i]}`}>
//           {stats[key]}
//         </span>
//          <span key={key} className={`px-2 py-1 rounded  font-bold ${colorsText[i]}`}>
//           {stats[key]}
//         </span>
//        </div>
        
//       ))}
//     </div>
//   );
// };
// const CategoriesRow = ({ product, index,setShowCatModal }) => {
  
//   return (
//     <tr key={product._id} className="text-center">
//       <td className="px-4 py-2 font-medium text-gray-900">{index + 1}</td>
//       <td className="px-4 py-2   text-gray-700">
//         <div className="w-24"> {product.groupName}</div>
//        </td>
//       <td className="px-4 py-2  text-gray-700">
//                 <div className="w-24"> {product.categoryName}</div>

//        </td>

//       <td className="px-4 py-2  text-gray-700">
//                 <div className="w-24"> {product.supervisor}</div>

//        </td>
//       <td className="px-4 py-2 text-gray-700">
//         <QuestionStats stats={product.questions} />
//       </td>
//       <td className="px-4 py-2">
//         <div className=" bg-[#085E9C]  rounded flex items-center justify-center">
//                   <img src={product.img} alt={`${product.categoryName} logo`} className="w-6 h-6 rounded-full" />

//         </div>
//       </td>
//       <td className="px-4 py-2 text-gray-700">
//         <QuestionStats stats={product.publishedQuestions} />
//       </td>
//       <td className="px-4 py-2 text-gray-700">
//         <div className="w-24">
//  {product.users}
//         </div>
//        </td>
//    <td className="px-4 py-2">
//   <span
//     className={`px-3 py-1 rounded font-bold ${
//       product.status === "منشورة" ? "text-[#588a17]" : "text-[#db2777]"
//     }`}
//   >
//     {product.status}
//   </span>
// </td>

//       <td className="px-4 py-2">
//         <button className=" py-2 w-24 bg-[#085e9c] text-white rounded cursor-pointer"
//         onClick={() => setShowCatModal(true)}>
//           إضافة صورة
//         </button>
        
//       </td>
//     </tr>
//   );
// };


// const Categories = () => {
//    const dispatch = useDispatch<AppDispatch>();
//     const {games } = useSelector((state: RootState) => state.game);
//     useEffect(() =>{
// dispatch(getGames())
//     },[])
//     console.log(games)
// const [products] = useState(data);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//     const [showCatModal, setShowCatModal] = useState(false);

//   const filteredProducts = useMemo(() => {
//     return products.filter((product) => {
//       const matchesSearch =
//         product.groupName.includes(searchQuery) || product.categoryName.includes(searchQuery);
//       const matchesStatus = !statusFilter || product.status === statusFilter;
//       return matchesSearch && matchesStatus;
//     });
//   }, [products, searchQuery, statusFilter]);





//   return (
//     <div className="p-4">
 

//  {/* Header Controls */}
//       <div className="flex flex-col p-4  bg-white md:flex-row items-center justify-between gap-4 ">
//     <div className="flex gap-4 items-center w-full md:w-auto">
//           <div className="text-xl ml-16 font-bold text-[#085E9C]">    الفئات</div>
//  {/* Search */}
//           <div className="relative w-full md:w-64 border rounded-md  border-[#085E9C]">
//             <input
//               type="text"
//               placeholder="بحث"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md  focus:outline-none  "
//             />
//             <FiSearch className="absolute left-3 top-3 text-gray-500" />
//           </div>

//           {/* Dropdown */}
//         <CustomDropdown
//    options={[
//     { value: "", label: "الأحدث  " },
//     { value: "الجنسية", label: "الجنسية" },
//     { value: " تاريخ التسجيل", label: " تاريخ التسجيل" },
//         { value: " عدد الألعاب", label: " عدد الألعاب" },
//     { value: " المشتريات", label: " المشتريات" },
//     { value: "  حالة الحساب", label: "  حالة الحساب" },

//   ]}
//   selected={statusFilter}
//   onChange={setStatusFilter}
// />
//     </div>
      
//       </div>
//         <div className="overflow-auto">
//           <table className="min-w-full  divide-y-2 divide-[#085E9C] bg-white text-sm">
//              <thead className="text-center">
//               <tr className="px-4 py-2  text-sm text-[#085E9C]">
//                 <th className="px-4 w-auto py-2 font-medium">رقم</th>
//                 <th className="px-4 py-2  font-medium">أسم المجموعة   </th>
//                 <th className="px-4 py-2 font-medium">أسم الفئة  </th>
//                 <th className="px-4 py-2 font-medium">مشرف  الفئة    </th>
//                 <th className="px-4 py-2 font-medium"> 

// <div className="mb-2">ألأسئلة المعتمدة</div>
// <div className="flex items-center justify-between ">
//   <span>200</span>
//   <span>400</span>
//   <span>600</span>
//   <span>الكل</span>
// </div>
//                 </th>
//                 <th className="px-4 py-2 font-medium"> صورة الفئة    </th>

//                 <th className="px-4 py-2 font-medium">   
//                   <div className="mb-2">ألأسئلة المنشورة</div>
// <div className="flex items-center justify-between ">
//   <span>200</span>
//   <span>400</span>
//   <span>600</span>
//   <span>الكل</span>
// </div>
//                    </th>
//                 <th className="px-4 py-2 font-medium">مستخدمي  الفئة  
//                    </th>
//                 <th className="px-4 py-2 font-medium">حالة الفئة      </th>
//                 <th className="px-4 py-2 font-medium"> إدارة    </th>
               
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//            {Array.isArray(games?.data) && games.data.length > 0 ? (
//   games.data.map((product, index) => (
//     <CategoriesRow
//       key={product._id}
//       product={product}
//       setShowCatModal={setShowCatModal}
//       index={index}
//     />
//   ))
// ) : (
//   <tr>
//     <td colSpan={10} className="px-4 py-6 text-center text-gray-500">
//       لم يتم العثور على نتائج.
//     </td>
//   </tr>
// )}

//           </tbody>
//           </table>
//           <CustomModal isOpen={showCatModal}>
//         <AddCategories onClose={() => setShowCatModal(false)} />
//       </CustomModal>
//         </div>
//                <Pagination pageCount={6} onPress={1} />

//     </div>
//   );
// };

// export default Categories;













































