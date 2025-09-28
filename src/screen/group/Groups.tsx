import React, { useEffect, useRef, useState } from "react";
import { EditIcon, Search, Trash2 } from "lucide-react";
// import CustomDropdown from "../../components/CustomDropdown";
import CustomModalGroup from "../../components/Modals/CustomModalGroup";
import CustomModal from "../../components/Modals/CustomModal";
import AddGroup from "./AddGroup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../../store/categoriesSlice";
import { toast } from "sonner";
import Pagination from "../../components/pagination/Pagination";
import { Link } from "react-router-dom";

const Groups: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);

  const [searchQuery, setSearchQuery] = useState<string>("");
  // const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalFormOpen, setModalFormOpen] = useState(false);
  // @ts-ignore
  const [selectedGroup, setSelectedGroup] = useState<null | any>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [nameGroup, setNameGroap] = useState("");
  const [descriptionGroup, setDescriptionGroap] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetGroup = () => {
    setDescriptionGroap("");
    setNameGroap("");
    setImage(null);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const handleStatusClick = (Group) => {
    setSelectedProduct(Group);
    setModalOpen(true);
  };
  const handleDeleteGroup = (id: string) => {
    toast("هل أنت متأكد من حذف هذه المجموعة؟", {
      action: {
        label: "حذف",
        onClick: async () => {
          try {
            const resultAction = await dispatch(deleteCategory(id));
            if (deleteCategory.fulfilled.match(resultAction)) {
              toast.success("تم حذف المجموعة بنجاح!");
            } else {
              toast.error("حدث خطأ أثناء الحذف");
            }
          } catch {
            toast.error("فشل الاتصال بالسيرفر");
          }
        },
      },
    });
  };

  const handleConfirmStatus = (data: { id: string; is_active: boolean }) => {
    const formData = new FormData();
    formData.append("is_active", JSON.stringify(data.is_active));

    dispatch(
      updateCategory({
        id: data.id,
        formData: formData,
      })
    );
    setModalOpen(false);
  };

  const handleFormClick = (Group?) => {
    setSelectedGroup(Group || null);
    setModalFormOpen(true);
  };

  const handleConfirmForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameGroup || !descriptionGroup || !image) {
      toast.error("يرجى استكمال جميع الحقول!");
      return;
    }

    const formData = new FormData();
    formData.append("name", nameGroup);
    if (image) formData.append("image", image);
    formData.append("description", descriptionGroup);

    try {
      const resultAction = await dispatch(addCategory(formData));
      if (addCategory.fulfilled.match(resultAction)) {
        toast.success("تمت إضافة المجموعة بنجاح!");
        setModalFormOpen(false);
        resetGroup();
      } else {
        toast.error("حدث خطأ أثناء الإضافة");
      }
    } catch {
      toast.error("فشل الاتصال بالسيرفر");
    }
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(getCategories({ page: 1, search: searchQuery }));
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dispatch]);

  useEffect(() => {
    dispatch(getCategories({ page: currentPage, search: searchQuery }));
  }, [currentPage, searchQuery, dispatch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const GroupsCard = ({ Group, onStatusClick, onDeleteClick }) => (
    <div className="bg-[#fafbff] border border-[#000] rounded p-4 w-full max-w-[200px] flex flex-col items-center relative">
      <div className="text-center mb-3 w-full">
        <div className="border border-[#085E9C] rounded p-2 text-sm font-medium text-[#000] text-center">
          {Group.name}
        </div>
      </div>

      <div className="text-center mb-3 w-full">
        <div className="border border-[#085E9C] rounded text-xs min-h-[40px] flex items-center justify-center p-3">
          {Group.image ? (
            <img
              src={Group.image}
              alt="Group"
              className="rounded max-h-32 object-contain"
            />
          ) : (
            <span className="text-[#000] py-4">نزيل هنا صورة الفئة</span>
          )}
        </div>
      </div>

      <div className="text-center mb-3 border p-3 border-[#085E9C] text-[#000] w-full">
        <p className="text-xs leading-relaxed">{Group.description || "_"}</p>
      </div>

      <div className="text-center mb-3 w-full">
        <div className="border border-[#085E9C] text-[#000] rounded px-3 py-1 text-sm font-medium text-center">
          445
        </div>
      </div>

      <div className="text-center mb-3 w-full">
        <button
          className="bg-[#085E9C] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors w-full"
          onClick={onStatusClick}
        >
          نشر / إيقاف النشر
        </button>
      </div>

      <div className="text-center mb-2 w-full">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            Group.is_active ? "text-green-600" : "text-red-500"
          }`}
        >
          {Group.is_active ? "منشورة" : "موقوفة"}
        </span>
      </div>

      <div className="text-center w-full mt-2">
        <p className="text-xs text-gray-700 font-medium">ماهر البوعلي</p>
      </div>
      <div className="flex justify-center gap-2 mt-2 w-full">
        {/* زر التعديل */}
        <Link
          to={`/group/edit/${Group.id}`}
          className="flex items-center bg-[#085E9C]  px-2 py-1 cursor-pointer text-white rounded text-xs"
        >
          <EditIcon size={16} />
        </Link>

        {/* زر الحذف */}
        <div
          className="flex items-center bg-red-500 px-2 py-1 cursor-pointer text-white rounded text-xs"
          onClick={onDeleteClick}
        >
          <Trash2 size={16} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row p-4 bg-white items-start md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-auto">
          <div className="text-xl font-bold text-[#085E9C]">المجموعات</div>

          {/* Search */}
          <div className="relative w-full md:w-64 border rounded-md border-[#085E9C]">
            <input
              type="text"
              placeholder="البحث ب الاسم"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none text-right"
            />
            <Search className="absolute left-3 top-3 text-gray-500" />
          </div>

          {/* Dropdown */}
          {/* <CustomDropdown
            options={[
              { value: "", label: "الأحدث" },
              { value: "الجنسية", label: "الجنسية" },
              { value: "تاريخ التسجيل", label: "تاريخ التسجيل" },
              { value: "عدد الألعاب", label: "عدد الألعاب" },
              { value: "المشتريات", label: "المشتريات" },
              { value: "حالة الحساب", label: "حالة الحساب" },
            ]}
            selected={statusFilter}
            onChange={setStatusFilter}
          /> */}
        </div>

        <div className="flex items-center space-x-4 space-x-reverse mt-2 md:mt-0">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-[#085E9C] border border-[#085E9C] px-8 py-2 font-bold rounded text-sm transition-colors"
            onClick={() => handleFormClick()}
          >
            إضافة مجموعة
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white border-2 border-[#085E9C] overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between p-4">
            <button className="w-full sm:w-[40%] bg-white rounded py-4 px-6 text-center font-bold text-[#085E9C] border border-[#085E9C]">
              جغرافيا والعالم
            </button>
            <button
              className="w-full sm:w-[40%] bg-yellow-500 rounded py-4 px-6 text-center font-bold text-[#085E9C] border border-[#085E9C]"
              onClick={() => setShowGroupModal(true)}
            >
              إضافة فئة فرعية
            </button>
            <button className="w-full sm:w-[20%] py-4 px-6 bg-[#085E9C] rounded text-center font-bold text-white border border-[#085E9C]">
              حفظ
            </button>
          </div>

          <CustomModal isOpen={showGroupModal}>
            <AddGroup onClose={() => setShowGroupModal(false)} />
          </CustomModal>

          <div className="p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center">
              {Array.isArray(categories?.data) &&
              categories?.data.length > 0 ? (
                categories?.data.map((Group, index) => (
                  <GroupsCard
                    key={index}
                    Group={Group}
                    onStatusClick={() => handleStatusClick(Group)}
                    onDeleteClick={() => handleDeleteGroup(Group.id.toString())}
                  />
                ))
              ) : (
                <p>لا توجد مجموعات حالياً</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      {selectedProduct && (
        <CustomModalGroup
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmStatus}
          status={selectedProduct.is_active}
          id={selectedProduct.id}
        />
      )}

      {/* Add/Edit Group Modal */}
      {modalFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md p-6 shadow-lg w-full max-w-md border border-blue-300">
            <form>
              <label className="mb-4 text-[#085E9C] font-bold text-lg">
                أسم المجموعة
              </label>
              <input
                type="text"
                value={nameGroup}
                onChange={(e) => setNameGroap(e.target.value)}
                className="w-full border border-[#085E9C] rounded mt-4 p-3 text-sm shadow-md outline-none text-right"
              />

              <div className="flex flex-col w-full mt-4">
                <label className="mb-1 text-lg font-bold text-[#085E9C]">
                  وصف المجموعة
                </label>
                <input
                  value={descriptionGroup}
                  onChange={(e) => setDescriptionGroap(e.target.value)}
                  type="text"
                  className="w-full bg-[#D5D5D5] rounded border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
                />
              </div>

              <div className="w-full flex flex-col mt-4">
                <label className="mb-3 text-lg font-bold text-[#085E9C]">
                  صورة المجموعة
                </label>
                <div
                  className="w-full h-[200px] border border-[#085E9C] flex items-center justify-center cursor-pointer rounded-md hover:shadow-lg transition"
                  onClick={handleImageClick}
                >
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-[60px] h-[60px]"
                    />
                  ) : (
                    <img
                      src="/images/group/img.png"
                      alt="Placeholder"
                      className="w-[60px] h-[60px]"
                    />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleConfirmForm}
                  className="px-4 py-2 text-white rounded bg-[#085E9C]"
                >
                  حفظ
                </button>
                <button
                  onClick={() => setModalFormOpen(false)}
                  className="px-4 py-2 border border-[#085E9C] text-[#085E9C] rounded hover:bg-blue-50"
                >
                  إغلاق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pagination */}
      {categories?.meta?.last_page > 1 && (
        <div className="mt-6 flex justify-start">
          <Pagination
            pageCount={categories.meta.last_page}
            onPress={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Groups;
