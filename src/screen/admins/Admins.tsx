
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddAdmins from "./AddAdmins";
import CustomModal from "../../components/Modals/CustomModal";
import { AppDispatch, RootState } from "../../store";
import { getAdmins } from "../../store/adminSlice";

const SupervisorCard = ({ supervisor }) => {
  return (
    <div className="border border-[##085E9C] p-4 rounded shadow bg-white space-y-4">
      <div className="grid grid-cols-4 gap-2 items-center font-bold text-[#085E9C]">
        <div className="col-span-1 border rounded border-[#085E9C] p-4 text-center">{supervisor.name}</div>
        <div className="col-span-1 bg-yellow-400 text-center border rounded border-[#085E9C] p-4">{supervisor.phone_number}</div>
        <div className="col-span-1 bg-yellow-400 text-center border rounded border-[#085E9C] p-4">{supervisor.email}</div>
        <div className="col-span-1 bg-yellow-400 text-center border rounded border-[#085E9C] p-4">Admin</div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {supervisor.categories?.map((cat, i) => (
          <div key={i} className="border font-[500] rounded border-[#085E9C] text-center py-1">
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Admins() {
  const [showAdminModal, setShowAdminModal] = useState(false);
   const dispatch = useDispatch<AppDispatch>();

  const { admins, loading, error } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(getAdmins());
  }, [dispatch]);

 return (
    <div className="p-4">
      <div className="flex justify-between items-center bg-white border-b-[#085E9C] border-b p-2">
        <h1 className="text-xl font-bold text-[#085E9C]">المشرفين</h1>

        <button
          className="bg-yellow-400 border border-[#085E9C] text-[#085E9C] px-4 py-2 rounded shadow text-md font-bold"
          onClick={() => setShowAdminModal(true)}
        >
          إضافة مشرف
        </button>

        <CustomModal isOpen={showAdminModal}>
          <AddAdmins onClose={() => setShowAdminModal(false)} />
        </CustomModal>
      </div>

      <div className="space-y-6 p-2 pt-10 bg-white">
        {loading && <p>جارٍ التحميل...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {Array.isArray(admins?.data) && admins.data.length > 0 ? (
          admins.data.map((sup, idx) => (
            <SupervisorCard key={idx} supervisor={sup} />
          ))
        ) : (
          !loading && <p className="text-center text-gray-500">لا يوجد مشرفين حاليًا.</p>
        )}
      </div>
    </div>
  );
}

// import { useState } from "react";
//  import AddAdmins from "./AddAdmins";
// import CustomModal from "../../components/Modals/CustomModal";

 
// const supervisors = [
//   {
//     name: "Admin  ",
//     email: "mahertop@hotmail.com",
//     phone: "0505960785",
//     role: "مدير",
//     categories: ["فن أجنبي", "دول وعواصم", "فن أجنبي","ألغاز", "دول وعواصم", "ضمن الصورة", "فن أجنبي"],
//   },
//   {
//     name: "محمد الناصر",
//     email: "mahertop@hotmail.com",
//     phone: "0505960785",
//     role: "مدير",
//     categories: ["ألغاز", "دول وعواصم", "ضمن الصورة", "تاريخ", "أمثال"],
//   },
// ];

// const SupervisorCard = ({ supervisor }) => {
//   return (
//     <div className="border border-[##085E9C] p-4 rounded shadow bg-white space-y-4">
//       <div className="grid grid-cols-4 gap-2 items-center font-bold text-[#085E9C]">
//         <div className="col-span-1 border rounded border-[#085E9C] p-4 text-center  ">{supervisor.name}</div>
//         <div className="col-span-1 bg-yellow-400 text-center  border rounded border-[#085E9C] p-4 ">{supervisor.phone}</div>
//         <div className="col-span-1 bg-yellow-400 text-center  border rounded border-[#085E9C] p-4 ">{supervisor.email}</div>
//         <div className="col-span-1 bg-yellow-400 text-center  border rounded border-[#085E9C] p-4 ">{supervisor.role}</div>
//       </div>

//       <div className="grid grid-cols-4 gap-2">
//         {supervisor.categories.map((cat, i) => (
//           <div key={i} className="border font-[500] rounded border-[#085E9C] text-center py-1">
//             {cat}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default function Admins() {
//   const [showAdminModal, setShowAdminModal] = useState(false);
//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center bg-white border-b-[#085E9C] border-b p-2">
//         <h1 className="text-xl font-bold text-[#085E9C]">المشرفين</h1>
        
//                 <button className="bg-yellow-400 border border-[#085E9C] text-[#085E9C] px-4 py-2 rounded shadow text-md font-bold"
//                   onClick={() => setShowAdminModal(true)}>إضافة مشرف</button>
 
//       <CustomModal isOpen={showAdminModal}>
//         <AddAdmins onClose={() => setShowAdminModal(false)} />
//       </CustomModal>
//       </div>

//       <div className="space-y-6 p-2 pt-10 bg-white">
//         {supervisors.map((sup, idx) => (
//           <SupervisorCard key={idx} supervisor={sup} />
//         ))}
//       </div>
//     </div>
//   );
// }
