import React, { useState } from 'react';
 import { FiSearch } from 'react-icons/fi';
import CustomDropdown from '../../components/CustomDropdown';
import CustomModalGroup from '../../components/Modals/CustomModalGroup';
import CustomModal from '../../components/Modals/CustomModal';
import AddGroup from './AddGroup';

interface GroupsData {
  _id: string;
  name: string;
  description: string;
  questionCount: number;
  status: 'منشورة' | 'موقوفة';
  supervisor: string;
  buttonText: string;
}

const Groups: React.FC = () => {
   const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState("");
const [modalOpen, setModalOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
const [modalFormOpen, setModalFormOpen] = useState(false);
const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);

const handleStatusClick = (Group) => {
  setSelectedProduct(Group);
  setModalOpen(true);
};
const handleConfirmStatus = () => {
   setModalOpen(false);
 };


 const handleFormClick = (Group) => {
  setSelectedGroup(Group);
  setModalFormOpen(true);
};
const handleConfirmForm = () => {
   setModalFormOpen(false);
 };

  const Groups: GroupsData[] = [
    {
      _id: '1',
      name: 'دول وعواصم',
      description: 'هذه الفئة تختص بدولة ما وعاصمتها واعلامها واطلاقها',
      questionCount: 455,
      status: 'منشورة',
      supervisor: 'ماهر البوعلي',
      buttonText: 'نشر / إيقاف النشر'
    },
    {
      _id: '2',
      name: 'أعلام',
      description: 'هذه الفئة تختص بدولة ما وعاصمتها واعلامها واطلاقها',
      questionCount: 455,
      status: 'موقوفة',
      supervisor: 'ماهر البوعلي',
      buttonText: 'نشر / إيقاف النشر'
    },
    {
      _id: '3',
      name: 'لغات',
      description: 'هذه الفئة تختص بدولة ما وعاصمتها واعلامها واطلاقها',
      questionCount: 455,
      status: 'موقوفة',
      supervisor: 'ماهر البوعلي',
      buttonText: 'نشر / إيقاف النشر'
    },
    {
      _id: '4',
      name: 'عملات',
      description: 'هذه الفئة تختص بدولة ما وعاصمتها واعلامها واطلاقها',
      questionCount: 455,
      status: 'منشورة',
      supervisor: 'ماهر البوعلي',
      buttonText: 'نشر / إيقاف النشر'
    },
    {
      _id: '5',
      name: 'مناطق',
      description: 'هذه الفئة تختص بدولة ما وعاصمتها واعلامها واطلاقها',
      questionCount: 455,
      status: 'منشورة',
      supervisor: 'ماهر البوعلي',
      buttonText: 'نشر / إيقاف النشر'
    }
  ];

  const GroupsCard = ({ Group, onStatusClick }) => (
    <div className="bg-[#fafbff] border border-[#000] rounded p-4 w-full max-w-[200px]">
      {/* Category Name */}
      <div className="text-center mb-3">
        <div className=" border border-[#0765AA] rounded p-2 text-sm font-medium text-[#000">
          {Group.name}
        </div>
      </div>

      {/* Image Placeholder */}
      <div className="text-center mb-3">
        <div className=" border border-[#0765AA] text-[#000] rounded p-3 py-6 text-xs  min-h-[40px] flex items-center justify-center">
          نزيل هنا صورة الفئة
        </div>
      </div>

      {/* Description */}
      <div className="text-center mb-3 border p-3 border-[#0765AA] text-[#000]">
        <p className="text-xs leading-relaxed ">
          {Group.description}
        </p>
      </div>

      {/* Question Count */}
      <div className="text-center mb-3">
        <div className=" border border-[#0765AA] text-[#000] rounded px-3 py-1 text-sm font-medium   " >
          {Group.questionCount}
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center mb-3">
        <button className="bg-[#0765AA] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors w-full" 
         onClick={onStatusClick}>
          {Group.buttonText}
        </button>
      </div>

      {/* Status */}
      <div className="text-center mb-2" >
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          Group.status === 'منشورة' 
            ? 'text-green-600' 
            : 'text-red-500'
        }`}>
          {Group.status}
        </span>
      </div>

      {/* Supervisor */}
      <div className="text-center">
        <p className="text-xs text-gray-700 font-medium">
          {Group.supervisor}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
     
<div className="flex  p-4  bg-white md:flex-row items-center justify-between gap-4 ">
    <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="text-xl ml-16 font-bold text-[#0765AA]">المجموعات</div>
 {/* Search */}
          <div className="relative w-full md:w-64 border rounded-md  border-[#0765AA]">
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
      <div className="flex items-center space-x-4 space-x-reverse">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-[#0765AA] border border-[#0765AA] px-4 py-2 rounded text-sm font-medium transition-colors"
              onClick={handleFormClick}>
                إضافة مجموعة
              </button>
            </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white border-2 border-[#0765AA]  overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-2 items-center justify-between  p-4 ">
            <button
             
              className={`  w-[40%] bg-white rounded py-4 px-6 text-center font-medium transition-colors text-[#0765AA] border border-[#0765AA]`}
            >
              جغرافيا والعالم
            </button>
            <button
              className={` w-[40%] bg-yellow-500 rounded py-4 px-6 text-center font-medium transition-colors border border-[#0765AA] text-[#0765AA] `}
            onClick={() => setShowGroupModal(true)}

            >
              إضافة فئة فرعية
            </button>
            
             <button
               className={` w-[20%] py-4 px-6 bg-[#0765AA] rounded text-center font-medium transition-colors  text-white border border-[#0765AA]`}
            >
              حفظ
            </button>
          </div>
<CustomModal isOpen={showGroupModal}>
        <AddGroup onClose={() => setShowGroupModal(false)} />
      </CustomModal>
          {/* Content */}
          <div className="p-3 ">
            
              <div className="grid grid-cols-5 gap-4 justify-center">
                {Groups.map((Group) => (
                  <GroupsCard key={Group._id} Group={Group}  onStatusClick={() => handleStatusClick(Group)}/>
                ))}
              </div>
             

             
            
          </div>
        </div>
      </div>
      {selectedProduct && (
        <CustomModalGroup
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmStatus}
          status={selectedProduct.status}
        />
      )}




      {/* add group */}
            {modalFormOpen && selectedGroup  && ( 
                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-6 shadow-lg w-full max-w-md border border-blue-300">
       
         <label className="mb-4 text-[#0765AA] font-bold text-lg"> أسم المجموعة </label>
      <input
        type="text"
          className="w-full border border-[#0765AA] rounded mt-4  p-3 text-sm shadow-md outline-none text-right"
      />
        <div className="flex justify-center gap-4 mt-6">
             <button
            onClick={handleConfirmForm}
            className={`px-4 py-2 text-white rounded bg-[#0765AA] `}
          >
           حفظ
          </button>
          <button
            onClick={() => setModalFormOpen(false)}
            className="px-4 py-2 border border-[#0765AA] text-[#0765AA] rounded hover:bg-blue-50"
          >
            إغلاق
          </button>
         
        </div>
        
      </div>
    </div>
            )}
      
    </div>
  );
};

export default Groups;