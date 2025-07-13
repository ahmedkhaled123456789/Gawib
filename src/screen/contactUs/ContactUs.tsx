import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import ContactForm from "./ContactForm";
 
const dummyProducts = [
  {
    _id: "1",
    name: " علي حسين",
    email: "hkjsd@hotmail.com ",
     message: "اللعبة جدا ممتارة لكن ينقصها الكثر من الفئات الغير متوفة وبالتالي اتمنى اضافة فئة فنون عربية ",
    reply: "سنرى ماذا يمكننا ان نفعل وسنضع ذلك في عين الاعتبار ",
    status: "جديد",
   
  
  },
 {
    _id: "2",
    name: " علي حسين",
    email: "hkjsd@hotmail.com ",
     message: "اللعبة جدا ممتارة لكن ينقصها الكثر من الفئات الغير متوفة وبالتالي اتمنى اضافة فئة فنون عربية ",
    reply: "سنرى ماذا يمكننا ان نفعل وسنضع ذلك في عين الاعتبار ",
    status: "منتهي",
   
  
  },
   
 ];

const ProductRow = ({ product, index ,setShowModal}) => {
  return (
    <tr key={product._id}>
      <td className="px-4 py-2 font-medium text-gray-900">{index + 1}</td>
      <td className="px-4 py-2 text-gray-700">
        <Link to={`/productDetails/${product._id}`}>{product.name}</Link>
      </td>
      <td className="px-4 py-2 text-gray-700">{product.email}</td>
      <td className="px-4 py-2 text-gray-700">{product.message}</td>
      <td className="px-4 py-2 text-gray-700">{product.reply}</td>  
        <td  className="px-4 py-2 text-white">
  <button
         onClick={() => setShowModal(true)}
 disabled={product.status === "منتهي"}       
    className={`px-4 py-2 w-full rounded font-semibold cursor-pointer ${
            product.status === 'جديد' ? 'bg-[#085E9C]' : 'text-[#085E9C]  border border-[#085E9C]'
          }`}
        >
          {product.status}
        </button>
  
</td>
    </tr>
  );
};

const ContactUs = () => {
  const [products] = useState(dummyProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
      const [showModal, setShowModal] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
 {/* Header Controls */}
      <div className="flex flex-col p-4  bg-white md:flex-row items-center justify-between gap-4 ">
    <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="text-xl ml-16 font-bold text-[#085E9C]">اتصل بنا</div>
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
   

  ]}
  selected={statusFilter}
  onChange={setStatusFilter}
/>
    </div>
        <div className="flex gap-4 items-center w-full md:w-auto">
         

          
        </div>
      </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#085E9C] bg-white text-sm">
            <thead className="text-center">
              <tr className="px-4 py-2 font-medium text-[#085E9C]">
                <th className="px-4 w-auto py-2 font-medium">رقم</th>
                <th className="px-4 py-2  font-medium">الأسم  </th>
                <th className="px-4 py-2 font-medium">البريد الإلكتروني</th>
                 <th className="px-4 py-2 font-medium">الرسالة</th>
                 <th className="px-4 py-2 font-medium">  الرد على الرسالة    </th>
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
<CustomModal isOpen={showModal}>
        <ContactForm onClose={() => setShowModal(false)} />
      </CustomModal>
    </div>
  );
};

export default ContactUs;
