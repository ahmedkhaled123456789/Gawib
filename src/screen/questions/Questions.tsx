import { useEffect, useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import AddQuestion from "./AddQuestion";
import EditQuestion from "./EditeQuestion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  getQuestions,
  deleteQuestion,
  updateQuestion,
} from "../../store/questionsSlice";
import { EditIcon, Trash } from "lucide-react";
import { toast } from "sonner";

const ProductRow = ({
  product,
  setSelectedId,
  setShowEditModal,
  handleDelete,
  dispatch,
}: any) => {
  // في دالة handleToggleActive في ProductRow
  const handleToggleActive = async () => {
    try {
      const formData = new FormData();
      formData.append("is_active", product.is_active ? "0" : "1");
      formData.append("_method", "PUT");

      await dispatch(
        updateQuestion({
          id: product.id.toString(),
          formData,
          isActivePage: false, // إضافة هذا السطر
        })
      ).unwrap();

      toast.success("تم تحديث حالة السؤال بنجاح");

      // إعادة تحميل البيانات بعد التحديث
      dispatch(
        getQuestions({
          page: 1,
        })
      );
    } catch (error) {
      toast.error("فشل في تحديث حالة السؤال");
    }
  };
  return (
    <tr className="text-xs md:text-sm">
      <td
        className="px-2 md:px-4 py-1 md:py-2 font-medium text-gray-900 max-w-[80px] md:max-w-[160px] truncate"
        title={product.id.toString()}
      >
        {product.id}
      </td>
      <td
        className="px-2 md:px-4 py-1 md:py-2 text-gray-700 max-w-[120px] md:max-w-[160px] truncate"
        title={product.game_name}
      >
        {product.game_name}
      </td>
      <td
        className="px-2 md:px-4 py-1 md:py-2 text-gray-700 max-w-[150px] md:max-w-[200px] truncate"
        title={product.question?.text || "—"}
      >
        {product.question_text || "—"}
      </td>
      <td
        className="px-2 md:px-4 py-1 md:py-2 text-gray-700 max-w-[150px] md:max-w-[200px] truncate"
        title={product.answer?.text || "—"}
      >
        {product.answer_text || "—"}
      </td>
      <td
        className="px-2 md:px-4 py-1 md:py-2 text-white text-xs md:text-sm"
        title={product.points.toString()}
      >
        <div
          className={`w-14 md:w-16 px-2 py-1 rounded text-center ${
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
      <td
        className="px-2 md:px-4 py-1 md:py-2 text-gray-700 max-w-[120px] md:max-w-[160px] truncate"
        title={product.hint || "—"}
      >
        {product.hint || "—"}
      </td>
      <td
        className="px-2 md:px-4 py-1 md:py-2 text-gray-700 max-w-[120px] md:max-w-[160px] truncate"
        title={product.admin_name || "محمد الناصر"}
      >
        {product.admin_name || "محمد الناصر"}
      </td>
      <td className="px-2 md:px-4 py-1 md:py-2 text-center">
        <input
          type="checkbox"
          checked={!!product.is_active}
          onChange={handleToggleActive}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
        />
      </td>
      <td className="px-2 md:px-4 py-1 md:py-2">
        <div className="flex items-center justify-end w-36 gap-2 flex-wrap">
          <span
            className="p-1 border cursor-pointer rounded bg-[#085E9C]"
            onClick={() => {
              setSelectedId(product.id);
              setShowEditModal(true);
            }}
          >
            <EditIcon className="w-4 h-4 md:w-5 md:h-5 cursor-pointer text-white bg-[#085E9C] hover:bg-[#0c4f7b]" />
          </span>
          <span
            className="cursor-pointer text-red-700"
            onClick={() => handleDelete(product.id)}
          >
            <Trash className="w-4 h-4 md:w-5 md:h-5" />
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
        <div className="flex flex-col md:flex-row p-2 md:p-4 bg-white items-start md:items-center justify-between gap-2">
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center w-full md:w-auto">
            <div className="text-sm md:text-md font-bold text-[#085E9C]">
              الأسئلة المعتمدة
            </div>
            <div className="relative w-full md:w-48 border rounded-md border-[#085E9C]">
              <input
                type="text"
                placeholder="ابحث بالفئة او السؤال"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-1 md:py-2 pl-6 md:pl-8 pr-2 border border-gray-300 rounded-md text-xs md:text-sm focus:outline-none"
              />
              <FiSearch className="absolute left-2 md:left-3 top-2 md:top-3 text-gray-500 text-xs md:text-sm" />
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
          <div className="flex flex-wrap items-center gap-1 md:gap-2">
            {[200, 400, 600].map((point) => (
              <span
                key={point}
                className={`text-xs md:text-sm text-[#ffc629] font-bold border cursor-pointer px-2 md:px-4 py-1 md:py-2 rounded ${
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

          {/* Add Question */}
          <div className="flex items-center mt-2 md:mt-0">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-[#085E9C] border border-[#085E9C] px-2 md:px-4 py-1 md:py-2 rounded text-xs md:text-sm font-medium transition-colors"
              onClick={() => {
                setSelectedId(null);
                setShowAddModal(true);
              }}
            >
              إضافة سؤال
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#085E9C] bg-white text-xs md:text-sm min-w-[600px] md:min-w-full">
            <thead className="text-center">
              <tr className="px-2 md:px-4 py-1 md:py-2 font-medium text-[#085E9C]">
                <th className="px-2 md:px-4 py-1">ID</th>
                <th className="px-2 md:px-4 py-1">أسم الفئة</th>
                <th className="px-2 md:px-4 py-1">السؤال</th>
                <th className="px-2 md:px-4 py-1">الجواب</th>
                <th className="px-2 md:px-4 py-1">النقاط</th>
                <th className="px-2 md:px-4 py-1">التلميح</th>
                <th className="px-2 md:px-4 py-1">مشرف الفئة</th>
                <th className="px-2 md:px-4 py-1">تفعيل</th>
                <th className="px-2 md:px-4 py-1">إدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y text-center divide-gray-200">
              {sortedQuestions.length > 0 ? (
                sortedQuestions.map((question) => (
                  <ProductRow
                    key={question.id}
                    product={question}
                    setShowEditModal={setShowEditModal}
                    setSelectedId={setSelectedId}
                    handleDelete={handleDelete}
                    dispatch={dispatch}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-2 py-2 text-gray-700">
                    لم يتم العثور على أسئلة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {questions?.meta?.last_page && (
          <Pagination pageCount={questions.meta.last_page} onPress={onPress} />
        )}

        {/* Add Modal */}
        <CustomModal isOpen={showAddModal}>
          <AddQuestion onClose={() => setShowAddModal(false)} />
        </CustomModal>

        {/* Edit Modal */}
        <CustomModal isOpen={showEditModal}>
          <EditQuestion
            selectedId={selectedId}
            onClose={() => {
              setSelectedId(null);
              setShowEditModal(false);
            }}
          />
        </CustomModal>
      </div>
    </div>
  );
};

export default Questions;
