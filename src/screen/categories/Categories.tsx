import { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import AddCategories from "./AddCategories";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getCategories } from "../../store/categoriesSlice";
 
const data = [
  {
    _id: "1",
    groupName: "جغرافيا والعالم",
    categoryName: "دول وعواصم",
    supervisor: "علي محمد",
    approvedQuestions: { total: 4164, q600: 4164, q400: 694, q200: 694 },
    publishedQuestions: { total: 4164, q600: 4164, q400: 694, q200: 694 },
    users: 30,
    status:"موقوفة",
    img:"/images/group/see.png"
  },
  {
    _id: "2",
    groupName: "الفنون",
    categoryName: "فن أجنبي",
    supervisor: "علي محمد",
    approvedQuestions: { total: 4164, q600: 4164, q400: 694, q200: 694 },
    publishedQuestions: { total: 4164, q600: 4164, q400: 694, q200: 694 },
    users: 1500,
    status:"منشورة",
    img:"/images/group/see.png"
  },
  {
    _id: "3",
    groupName: "ذكاء",
    categoryName: "فهم الصورة",
    supervisor: "علي محمد",
    approvedQuestions: { total: 4164, q600: 4164, q400: 694, q200: 694 },
    publishedQuestions: { total: 4164, q600: 4164, q400: 694, q200: 694 },
    users: 200,
    status:"منشورة",
    img:"/images/group/see.png"
  },
];
const QuestionStats = ({ stats }) => {
  const colors = ['bg-[#309222]', 'bg-[#9647c4]', 'bg-[#ae1113]', 'bg-[#292d32]'];
  const keys = ['total', 'q600', 'q400', 'q200'];
    const colorsText = ['text-[#309222]', 'text-[#9647c4]', 'text-[#ae1113]', 'text-[#292d32]'];


  return (
    <div className="flex items-center justify-between   w-48">
      {keys.map((key, i) => (
       <div className="grid grid-cols-1 gap-1">
        <span key={key} className={`px-2 py-1 rounded text-white font-bold ${colors[i]}`}>
          {stats[key]}
        </span>
         <span key={key} className={`px-2 py-1 rounded  font-bold ${colorsText[i]}`}>
          {stats[key]}
        </span>
       </div>
        
      ))}
    </div>
  );
};
const CategoriesRow = ({ product, index,setShowCatModal }) => {
   const dispatch = useDispatch<AppDispatch>();
    const {categories } = useSelector((state: RootState) => state.categories);
    useEffect(() =>{
dispatch(getCategories())
    },[])
    console.log(categories)
  return (
    <tr key={product._id} className="text-center">
      <td className="px-4 py-2 font-medium text-gray-900">{index + 1}</td>
      <td className="px-4 py-2   text-gray-700">
        <div className="w-24"> {product.groupName}</div>
       </td>
      <td className="px-4 py-2  text-gray-700">
                <div className="w-24"> {product.categoryName}</div>

       </td>

      <td className="px-4 py-2  text-gray-700">
                <div className="w-24"> {product.supervisor}</div>

       </td>
      <td className="px-4 py-2 text-gray-700">
        <QuestionStats stats={product.approvedQuestions} />
      </td>
      <td className="px-4 py-2">
        <div className=" bg-[#085E9C]  rounded flex items-center justify-center">
                  <img src={product.img} alt={`${product.categoryName} logo`} className="w-6 h-6 rounded-full" />

        </div>
      </td>
      <td className="px-4 py-2 text-gray-700">
        <QuestionStats stats={product.publishedQuestions} />
      </td>
      <td className="px-4 py-2 text-gray-700">
        <div className="w-24">
 {product.users}
        </div>
       </td>
   <td className="px-4 py-2">
  <span
    className={`px-3 py-1 rounded font-bold ${
      product.status === "منشورة" ? "text-[#588a17]" : "text-[#db2777]"
    }`}
  >
    {product.status}
  </span>
</td>

      <td className="px-4 py-2">
        <button className=" py-2 w-24 bg-[#085e9c] text-white rounded cursor-pointer"
        onClick={() => setShowCatModal(true)}>
          إضافة صورة
        </button>
        
      </td>
    </tr>
  );
};


const Categories = () => {
const [products] = useState(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
    const [showCatModal, setShowCatModal] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.groupName.includes(searchQuery) || product.categoryName.includes(searchQuery);
      const matchesStatus = !statusFilter || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);





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
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <CategoriesRow key={product._id} product={product}  setShowCatModal={setShowCatModal} index={index} />
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
        <AddCategories onClose={() => setShowCatModal(false)} />
      </CustomModal>
        </div>
               <Pagination pageCount={6} onPress={1} />

    </div>
  );
};

export default Categories;




























