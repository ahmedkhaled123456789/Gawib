import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/CustomModal";
import Dashboard from "../../components/Dashboard/Dashboard";
 
const dummyProducts = [
  {
    _id: "1",
    name: " علي حسين",
    email: "ماهر اليوعلي ماهر ",
    phone: "966505963256",
    nationality: "السعودية",
    Date: "#27/08/2025",
    status: "نشط",
    count: 10,
    total: 1000,
  
  },
{
    _id: "2",
    name: " علي حسين",
    email: "ماهر اليوعلي ماهر    ",
    phone: "966505963256",
    nationality: "سوريا",
    Date: "#27/08/2025",
    status: "نشط",
    count: 20,
    total: 1000,
  
  },
  {
    _id: "3",
    name: " علي حسين",
    email: "ماهر اليوعلي ماهر    ",
    phone: "966505963256",
    nationality: "الولايات المتحدة",
    Date: "#27/08/2025",
    status: "موقوف",
    count: 1,
    total: 3000,
  
  },
 ];

const ProductRow = ({ product, index ,onStatusClick}) => {
  return (
    <tr key={product._id}>
      <td className="px-4 py-2 font-medium text-gray-900">{index + 1}</td>
      <td className="px-4 py-2 text-gray-700">
        <Link to={`/productDetails/${product._id}`}><div className="w-24">{product.name}</div></Link>
      </td>
      <td className="px-4 py-2 text-gray-700"><div className="w-40">{product.email}</div></td>
      <td className="px-4 py-2 text-gray-700">{product.phone}</td>
      <td className="px-4 py-2 text-gray-700">{product.nationality}</td>
            <td className="px-4 py-2 text-gray-700">{product.Date}</td>

            <td className="px-4 py-2 text-gray-700"><div className="w-24">{product.count}</div></td>
            <td className="px-4 py-2    text-gray-700"> <div className="w-14"> <div  className={` w-2 h-2 p-2  rounded-md ${
            product.status === 'نشط' ? 'bg-[#588a17]' : 'bg-transparent'
          }`}
              ></div></div>
             
            </td>

      <td className="px-4 py-2 text-gray-700"> <div className="w-32">{product.total}</div></td>
       <td  className="px-4 py-2 text-white">
  <button
          onClick={onStatusClick}
          className={`px-4 py-2 w-full rounded font-semibold cursor-pointer ${
            product.status === 'نشط' ? 'bg-[#588a17]' : 'bg-[#ff426e]'
          }`}
        >
          {product.status}
        </button>
  
</td>
    </tr>
  );
};

const AllUsers = () => {
  const [products] = useState(dummyProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

 const [modalOpen, setModalOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);

const handleStatusClick = (product) => {
  setSelectedProduct(product);
  setModalOpen(true);
};

const handleConfirmStatus = () => {
   setModalOpen(false);
  alert(`تم تعديل حالة المستخدم ${selectedProduct?.name}`);
};


  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">

<div className="">
         <Dashboard/>
        </div>
 {/* Header Controls */}
      <div className="flex flex-col p-4  bg-white md:flex-row items-center justify-between gap-4 ">
    <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="text-xl ml-16 font-bold text-[#085E9C]">المستخدمين</div>
 {/* Search */}
          <div className="relative w-full md:w-64 border rounded-md  border-[#085E9C]">
            <input
              type="text"
              placeholder="بحث"
              value={searchQuery}
              onChange={handleSearch}
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
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#085E9C] bg-white text-sm">
            <thead className="text-right">
              <tr className="px-4 py-2 font-medium text-center text-[#085E9C]">
                <th className="px-4 w-auto py-2 font-medium">رقم</th>
                <th className="px-4 py-2  font-medium">الأسم  </th>
                <th className="px-4 py-2 font-medium">البريد الإلكتروني</th>
                <th className="px-4 py-2 font-medium">رقم الجوال  </th>
                <th className="px-4 py-2 font-medium">الجنسية</th>
                <th className="px-4 py-2 font-medium">تاريخ التسجيل</th>
                <th className="px-4 py-2 font-medium">عدد الألعاب  </th>
                <th className="px-4 py-2 font-medium">نشط الان    </th>
                <th className="px-4 py-2 font-medium"> إجمالي المشتريات  </th>
                <th className="px-4 py-2 font-medium">حالة الحساب</th>
              
              </tr>
            </thead>

            <tbody className="divide-y text-center divide-gray-200">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <ProductRow key={product._id} product={product} index={index}   onStatusClick={() => handleStatusClick(product)} />
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
{selectedProduct && (
  <CustomModal
    isOpen={modalOpen}
    onClose={() => setModalOpen(false)}
    onConfirm={handleConfirmStatus}
    status={selectedProduct.status}
  />
)}
    </div>
  );
};

export default AllUsers;




























