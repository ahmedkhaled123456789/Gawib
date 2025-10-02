import { useEffect, useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import AddQuestion from "./AddQuestion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getQuestions, deleteQuestion } from "../../store/questionsSlice";
import { Trash } from "lucide-react";
import { toast } from "sonner";

const ProductRow = ({
  product,
  setSelectedId,
  setShowPriceModal,
  handleDelete,
}) => {
  const renderContent = (data) => {
    if (!data) return "—";
    if (data.text) return data.text;
    if (data.image) return <span className="text-blue-500">📷 صورة</span>;
    if (data.video) return <span className="text-red-500">🎬 فيديو</span>;
    if (data.sound) return <span className="text-green-500">🎵 صوت</span>;
    return "—";
  };

  return (
    <tr key={product.id}>
      <td className="px-4 py-2 font-medium text-gray-900">{product.id}</td>
      <td className="px-4 py-2 text-gray-700">
        <Link to={`/productDetails/${product.id}`}>
          <div className="w-20 truncate">{product.game_name}</div>
        </Link>
      </td>
      <td className="px-4 py-2 text-gray-700 w-72 truncate">
        {renderContent(product?.question)}
      </td>
      <td className="px-4 py-2 text-gray-700 w-72 truncate">
        {renderContent(product?.answer)}
      </td>
      <td className="px-4 py-2 text-white">
        <div
          className={`w-16 px-4 py-1 rounded ${
            product.points === 200
              ? "bg-[#309222]"
              : product.points === 400
              ? "bg-[#9647c4]"
              : product.points === 600
              ? "bg-[#ae1113]"
              : "bg-gray-500"
          }`}
        >
          {product.points}
        </div>
      </td>
      <td className="px-4 py-2 text-gray-700 w-20">{product.hint || "—"}</td>
      <td className="px-4 py-2 text-gray-700 w-20">
        {product.admin_name || "محمد الناصر"}
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center justify-center w-40 gap-2 flex-wrap">
          <span
            className="p-1 border cursor-pointer rounded bg-[#085E9C]"
            onClick={() => {
              setSelectedId(product.id);
              setShowPriceModal(true);
            }}
          >
            <img src="/images/group/edit.png" alt="" className="w-5 h-5" />
          </span>
          <span
            className="cursor-pointer text-red-700"
            onClick={() => handleDelete(product.id)}
          >
            <Trash className="w-5 h-5" />
          </span>
        </div>
      </td>
    </tr>
  );
};

const Questions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { questions } = useSelector((state: RootState) => state.questions);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pointsFilter, setPointsFilter] = useState<string | null>(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedImg, setSelectedImg] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // جلب البيانات
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(
        getQuestions({
          page: 1,
          search: searchQuery,
          sort: statusFilter,
          points: pointsFilter || undefined,
        })
      );
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, statusFilter, pointsFilter, dispatch]);

  const onPress = async (page: number) => {
    await dispatch(
      getQuestions({
        page,
        search: searchQuery,
        sort: statusFilter,
        points: pointsFilter || undefined,
      })
    );
  };

  // الحذف
  const handleDelete = (id: string) => {
    toast("هل أنت متأكد من حذف السؤال؟", {
      action: {
        label: "حذف",
        onClick: () => {
          dispatch(deleteQuestion(id)).then(() => {
            dispatch(
              getQuestions({
                page: 1,
                search: searchQuery,
                sort: statusFilter,
                points: pointsFilter || undefined,
              })
            );
          });
          toast.success("تم حذف السؤال");
        },
      },
    });
  };

const sortedQuestions = useMemo(() => {
  if (!questions?.data || !Array.isArray(questions.data)) return [];

  if (statusFilter === "الفئة") {
    return [...questions.data].sort((a, b) =>
      (a.game_name || "").localeCompare(b.game_name || "")
    );
  }

  if (statusFilter === "المشرف") {
    return [...questions.data].sort((a, b) =>
      (a.admin_name || "").localeCompare(b.admin_name || "")
    );
  }

  return [...questions.data].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}, [questions, statusFilter]);

  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row p-4 bg-white items-start md:items-center justify-between gap-2">
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center w-full md:w-auto">
            <div className="text-md w-32 font-bold text-[#085E9C]">
              الأسئلة المعتمدة
            </div>
            <div className="relative w-full md:w-48 border rounded-md border-[#085E9C]">
              <input
                type="text"
                placeholder="ابحث بالفئة او السؤال"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-8 pr-4 border border-gray-300 rounded-md focus:outline-none"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-500" />
            </div>
            <CustomDropdown
              options={[
                { value: "created_at", label: "الأحدث" },
                { value: "الفئة", label: "الفئة" },
                { value: "المشرف", label: "المشرف" },
              ]}
              selected={statusFilter}
              onChange={setStatusFilter}
            />
          </div>

          {/* Points Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {[200, 400, 600].map((point) => (
              <span
                key={point}
                className={`text-[#ffc629] font-bold border cursor-pointer px-4 py-2 rounded ${
                  pointsFilter === point.toString()
                    ? "bg-[#085E9C] border-[#085E9C]"
                    : "border border-[#085E9C]"
                }`}
                onClick={() =>
                  setPointsFilter(
                    pointsFilter === point.toString() ? null : point.toString()
                  )
                }
              >
                {point}
              </span>
            ))}
          </div>

          {/* إضافة سؤال */}
          <div className="flex items-center mt-2 md:mt-0">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-[#085E9C] border border-[#085E9C] px-4 py-2 rounded text-sm font-medium transition-colors"
              onClick={() => {
                setSelectedId(null);
                setShowPriceModal(true);
              }}
            >
              إضافة سؤال
            </button>
          </div>
        </div>

        {/* الجدول */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#085E9C] bg-white text-sm min-w-[700px] md:min-w-full">
            <thead className="text-center">
              <tr className="px-4 py-2 font-medium text-[#085E9C]">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">أسم الفئة</th>
                <th className="px-4 py-2">السؤال</th>
                <th className="px-4 py-2">الجواب</th>
                <th className="px-4 py-2">النقاط</th>
                <th className="px-4 py-2">التلميح</th>
                <th className="px-4 py-2">مشرف الفئة</th>
                <th className="px-4 py-2">إدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y text-center divide-gray-200">
              {sortedQuestions.length > 0 ? (
                sortedQuestions.map((question) => (
                  <ProductRow
                    key={question.id}
                    product={question}
                    setShowPriceModal={setShowPriceModal}
                    setSelectedId={setSelectedId}
                    handleDelete={handleDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-2 text-gray-700">
                    لم يتم العثور على أسئلة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* صورة */}
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

        {/* Pagination */}
        {questions?.meta?.last_page && (
          <Pagination pageCount={questions.meta.last_page} onPress={onPress} />
        )}

        {/* Add/Edit Modal */}
        <CustomModal isOpen={showPriceModal}>
          <AddQuestion
            key={selectedId || "new"}
            selectedId={selectedId}
            onClose={() => {
              setSelectedId(null);
              setShowPriceModal(false);
            }}
          />
        </CustomModal>
      </div>
    </div>
  );
};

export default Questions;
