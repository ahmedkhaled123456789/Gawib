import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import ContactForm from "./ContactForm";
 import { getContacts } from "../../store/contactSlice"; 
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
const ProductRow = ({ product, index,setSelectedId, setShowModal }) => {
  
  return (
    <tr key={product.id}>
      <td className="px-4 py-2 font-medium text-gray-900">{index + 1}</td>
      <td className="px-4 py-2 text-gray-700">
        <Link to={`/productDetails/${product.id}`}>{product.first_name} {product.last_name}</Link>
      </td>
      <td className="px-4 py-2 text-gray-700">{product.email}</td>
      <td className="px-4 py-2 text-gray-700">{product.message}</td>
      <td className="px-4 py-2 text-gray-700">{product.answer || "—"}</td>
      <td className="px-4 py-2 text-white">
        <button
          onClick={() => {
            setSelectedId(product._id || product.id); 
            setShowModal(true);}}
          disabled={product.answer}
          className={`px-4 py-2 w-full rounded font-semibold cursor-pointer ${
            product.answer 
              ?  "text-[#085E9C] border border-[#085E9C]"
              : "bg-[#085E9C]" 
          }`}
        
        >
          {product.answer ? "منتهي" :  "جديد"}
        </button>
      </td>
    </tr>
  );
};

const ContactUs = () => {
const dispatch = useDispatch<AppDispatch>();
  const { contacts,loading ,error} = useSelector((state: RootState) => state.contact);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

   useEffect(() => {
    dispatch(getContacts());
  }, [dispatch]);

 

  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
        {/* Header Controls */}
        <div className="flex flex-col p-4  bg-white md:flex-row items-center justify-between gap-4 ">
          <div className="flex gap-4 items-center w-full md:w-auto">
            <div className="text-xl ml-16 font-bold text-[#085E9C]">اتصل بنا</div>

            {/* Search */}
            <div className="relative w-full md:w-64 border rounded-md border-[#085E9C]">
              <input
                type="text"
                placeholder="بحث"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-500" />
            </div>

            {/* Dropdown */}
            <CustomDropdown
              options={[{ value: "", label: "الأحدث" }]}
              selected={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#085E9C] bg-white text-sm">
            <thead className="text-center">
              <tr className="px-4 py-2 font-medium text-[#085E9C]">
                <th className="px-4 py-2">رقم</th>
                <th className="px-4 py-2">الاسم</th>
                <th className="px-4 py-2">البريد الإلكتروني</th>
                <th className="px-4 py-2">الرسالة</th>
                <th className="px-4 py-2">الرد</th>
                <th className="px-4 py-2">إدارة</th>
              </tr>
            </thead>

            <tbody className="divide-y text-center divide-gray-200">
          {loading ? (
  <tr>
    <td colSpan={6} className="px-4 py-2 text-gray-700">
      جاري التحميل...
    </td>
  </tr>
) : error ? (
  <tr>
    <td colSpan={6} className="px-4 py-2 text-red-500">
      {error}
    </td>
  </tr>
) : Array.isArray(contacts?.data.data) && contacts.data.data.length > 0 ? (
  contacts.data.data.map((product, index) => (
    <ProductRow
      key={product.id}
      product={product}
      index={index}
      setShowModal={setShowModal}
      setSelectedId={setSelectedId}
    />
  ))
) : (
  <tr>
    <td colSpan={6} className="px-4 py-2 text-gray-700">
      لا يوجد بيانات.
    </td>
  </tr>
)}


            </tbody>
          </table>
        </div>
      </div>

      <Pagination pageCount={6} onPress={1} />
      <CustomModal isOpen={showModal}>
        <ContactForm selectedId={selectedId} onClose={() => setShowModal(false)} />
      </CustomModal>
    </div>
  );
};

export default ContactUs;
