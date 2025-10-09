import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import AddCategories from "./AddCategories";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getGames, deleteGame } from "../../store/gameSlice";
import AddNewCategories from "./AddNewCategories";
import { EditIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

const QuestionStats = ({ stats }) => {
  const colors = [
    "bg-[#309222]",
    "bg-[#9647c4]",
    "bg-[#ae1113]",
    "bg-[#292d32]",
  ];
  const colorsText = [
    "text-[#309222]",
    "text-[#9647c4]",
    "text-[#ae1113]",
    "text-[#292d32]",
  ];
  return (
    <div className="flex items-center justify-between w-48">
      <div className="grid grid-cols-1 gap-1">
        <span className={`px-2 py-1 rounded text-white font-bold ${colors[0]}`}>
          {stats.active_points_200}
        </span>
        <span className={`px-2 py-1 rounded font-bold ${colorsText[0]}`}>
          {stats.active_points_200}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-1">
        <span className={`px-2 py-1 rounded text-white font-bold ${colors[1]}`}>
          {stats.active_points_400}
        </span>
        <span className={`px-2 py-1 rounded font-bold ${colorsText[1]}`}>
          {stats.active_points_400}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-1">
        <span className={`px-2 py-1 rounded text-white font-bold ${colors[2]}`}>
          {stats.active_points_600}
        </span>
        <span className={`px-2 py-1 rounded font-bold ${colorsText[2]}`}>
          {stats.active_points_600}
        </span>
      </div>
    </div>
  );
};

const QuestionStatsNon = ({ stats }) => {
  const colors = [
    "bg-[#309222]",
    "bg-[#9647c4]",
    "bg-[#ae1113]",
    "bg-[#292d32]",
  ];
  const colorsText = [
    "text-[#309222]",
    "text-[#9647c4]",
    "text-[#ae1113]",
    "text-[#292d32]",
  ];
  return (
    <div className="flex items-center justify-between w-48">
      <div className="grid grid-cols-1 gap-1">
        <span className={`px-2 py-1 rounded text-white font-bold ${colors[0]}`}>
          {stats.non_active_points_200}
        </span>
        <span className={`px-2 py-1 rounded font-bold ${colorsText[0]}`}>
          {stats.non_active_points_200}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-1">
        <span className={`px-2 py-1 rounded text-white font-bold ${colors[1]}`}>
          {stats.non_active_points_400}
        </span>
        <span className={`px-2 py-1 rounded font-bold ${colorsText[1]}`}>
          {stats.non_active_points_400}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-1">
        <span className={`px-2 py-1 rounded text-white font-bold ${colors[2]}`}>
          {stats.non_active_points_600}
        </span>
        <span className={`px-2 py-1 rounded font-bold ${colorsText[2]}`}>
          {stats.non_active_points_600}
        </span>
      </div>
    </div>
  );
};

const CategoriesRow = ({
  product,
  setSelectedImg,
  setSelectedId,
  setShowCatModal,
  handleDelete,
}) => {
  return (
    <tr key={product.id} className="text-center">
      <td className="px-4 py-2 font-medium text-gray-900">{product.id}</td>
      <td className="px-4 py-2 text-gray-700">
        <div className="w-24">{product.name}</div>
      </td>
      <td className="px-4 py-2 text-gray-700">
        <div className="w-24">{product?.category?.name || "_"}</div>
      </td>
      <td className="px-4 py-2 text-gray-700">
        <div className="w-24">{product.admin.name}</div>
      </td>
      <td className="px-4 py-2 text-gray-700">
        <QuestionStatsNon stats={product} />
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center justify-center">
          <img
            src={product.image}
            alt={`${product?.category?.name} logo`}
            className="w-12 h-12 rounded-full cursor-pointer"
            onClick={() => setSelectedImg(product.img)}
          />
        </div>
      </td>
      <td className="px-4 py-2 text-gray-700">
        <QuestionStats stats={product} />
      </td>
      <td className="px-4 py-2 text-gray-700">
        <div className="w-24">{product.number_of_plays}</div>
      </td>
      <td className="px-4 py-2">
        <span
          className={`px-3 py-1 rounded font-bold ${
            product.is_active ? "text-[#588a17]" : "text-[#db2777]"
          }`}
        >
          {product.is_active ? "منشورة" : "موقوفة"}
        </span>
      </td>
      <td className="px-4 py-2 flex items-center justify-center gap-2">
        <button
          className="p-2 bg-[#085e9c] text-white rounded-full hover:bg-[#064b7a] transition flex items-center justify-center"
          onClick={() => {
            setSelectedId(product.id);
            setShowCatModal(true);
          }}
        >
          <EditIcon size={18} />
        </button>
        <button
          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition flex items-center justify-center"
          onClick={() => handleDelete(product.id)}
        >
          <TrashIcon size={18} />
        </button>
      </td>
    </tr>
  );
};

const Categories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { games } = useSelector((state: RootState) => state.game);

  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("-created_at"); // state واحد يحوي العمود والاتجاه
  const [showCatModal, setShowCatModal] = useState(false);
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const userinfo = JSON.parse(localStorage.getItem("userinfo") || "{}");
  const adminId = userinfo?.id ?? 0;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(getGames({ page: 1, search: searchQuery, sort }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, sort]);

  const onPress = async (page) => {
    await dispatch(getGames({ page, search: searchQuery, sort }));
  };

  const handleDelete = (id: string) => {
    toast("هل تريد الحذف؟", {
      action: {
        label: "نعم",
        onClick: () => {
          dispatch(deleteGame(id)).then(() => {
            dispatch(getGames({ page: 1, search: searchQuery, sort }));
          });
        },
      },
    });
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col p-4 bg-white md:flex-row items-center justify-between gap-4">
        <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="text-xl font-bold text-[#085E9C]">الفئات</div>
          <div className="relative w-full md:w-64 border rounded-md border-[#085E9C]">
            <input
              type="text"
              placeholder="أسم المجموعة"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-500" />
          </div>

          <CustomDropdown
            options={[
              { value: "created_at", label: "الأحدث" },
              { value: "category", label: "الفئة" },
              { value: "admin", label: "المشرف" },
              { value: "number_of_plays", label: "عدد الألعاب" },
              { value: "status", label: "الحالة" },
            ]}
            selected={sort.replace("-", "")}
            onChange={(val) => {
              if (sort.replace("-", "") === val) {
                setSort(sort.startsWith("-") ? val : `-${val}`);
              } else {
                setSort(`-${val}`);
              }
            }}
          />
        </div>

        <div className="flex-shrink-0">
          <button
            className="py-2 w-36 bg-[#085e9c] text-white rounded"
            onClick={() => setShowAddCatModal(true)}
          >
            إضافة فئة جديدة
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full divide-y-2 divide-[#085E9C] bg-white text-sm">
          <thead className="text-center">
            <tr className="px-4 py-2 text-sm text-[#085E9C]">
              <th className="px-4 py-2 font-medium">ID</th>
              <th className="px-4 py-2 font-medium">أسم الفئة</th>
              <th className="px-4 py-2 font-medium">أسم المجموعة</th>
              <th className="px-4 py-2 font-medium">مشرف الفئة</th>
              <th className="px-4 py-2 font-medium">
                <div className="mb-2">ألأسئلة المعتمدة</div>
                <div className="flex items-center justify-between">
                  <span>200</span>
                  <span>400</span>
                  <span>600</span>
                </div>
              </th>
              <th className="px-4 py-2 font-medium">صورة الفئة</th>
              <th className="px-4 py-2 font-medium">
                <div className="mb-2">ألأسئلة المنشورة</div>
                <div className="flex items-center justify-between">
                  <span>200</span>
                  <span>400</span>
                  <span>600</span>
                </div>
              </th>
              <th className="px-4 py-2 font-medium">مستخدمي الفئة</th>
              <th className="px-4 py-2 font-medium">حالة الفئة</th>
              <th className="px-4 py-2 font-medium">إدارة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {games?.data.length > 0 ? (
              games.data.map((product) => (
                <CategoriesRow
                  setSelectedId={setSelectedId}
                  key={product._id}
                  setSelectedImg={setSelectedImg}
                  product={product}
                  setShowCatModal={setShowCatModal}
                  handleDelete={handleDelete}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  لم يتم العثور على نتائج.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modals */}
        <CustomModal isOpen={showCatModal}>
          <AddCategories
            selectedId={selectedId}
            onClose={() => setShowCatModal(false)}
          />
        </CustomModal>
        <CustomModal isOpen={showAddCatModal}>
          <AddNewCategories
            adminId={adminId}
            onClose={() => setShowAddCatModal(false)}
          />
        </CustomModal>

        {/* Preview Image */}
        {selectedImg && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setSelectedImg(null)}
          >
            <img
              src={selectedImg}
              alt="عرض الصورة"
              className="max-w-full max-h-full rounded shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      {games?.meta?.last_page && (
        <Pagination pageCount={games.meta.last_page} onPress={onPress} />
      )}
    </div>
  );
};

export default Categories;
