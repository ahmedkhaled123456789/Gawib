import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
// import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import CustomModal from "../../components/Modals/CustomModal";
import AddQuestion from "../questions/AddQuestion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getQuestions, updateQuestion } from "../../store/questionsSlice";

const ProductRow = ({
  product,
  setSelectedImg,
  setSelectedId,
  handleConfirmStatus,
  index,
  setShowPriceModal,
}: any) => {
  return (
    <tr key={product.id}>
      <td className="px-4 py-2 font-medium text-gray-900">{index + 1}</td>
      <td className="px-4 py-2 text-gray-700">
        <Link to={`/productDetails/${product.id}`}>
          <div className="w-20 truncate">{product.game_name}</div>
        </Link>
      </td>
      <td className="px-4 py-2 text-gray-700 w-72 truncate">
        {product.question.text}
      </td>
      <td className="px-4 py-2 text-gray-700 w-72 truncate">
        {product.answer.text}
      </td>
      <td className="px-4 py-2 text-white">
        <div
          className={`w-16 px-4 py-1 rounded ${
            product.points === 200
              ? "bg-[#309222]"
              : product.points === 400
              ? "bg-[#9647c4]"
              : "bg-[#ae1113]"
          }`}
        >
          {product.points}
        </div>
      </td>
      <td className="px-4 py-2 text-gray-700 w-20">
        {product.hint || "سنوات 2"}
      </td>
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
          <span className="p-1 border cursor-pointer rounded bg-[#085E9C]">
            <img
              src="/images/group/see.png"
              alt={`${product.game_name} logo`}
              className="w-6 h-6 cursor-pointer"
              onClick={() => setSelectedImg(product.question.image)}
            />
          </span>
          <button
            onClick={handleConfirmStatus}
            className="text-[#085E9C] border border-[#085E9C] rounded px-3 py-1 hover:bg-[#085E9C] hover:text-white"
          >
            اعتماد
          </button>
        </div>
      </td>
    </tr>
  );
};

const PostedQuestions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { questions } = useSelector((state: RootState) => state.questions);

  const [searchQuery, setSearchQuery] = useState("");
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(getQuestions({ page: 1, search: searchQuery }));
    }, 500); // debounce 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dispatch]);

  const handleConfirmStatus = (data: { id: string; is_active: boolean }) => {
    dispatch(
      updateQuestion({
        id: data.id,
        formData: { is_active: !data.is_active, _method: "PUT" },
      })
    );
  };

  const onPress = async (page: number) => {
    await dispatch(getQuestions({ page, search: searchQuery }));
  };

  // فلتر على is_active
  const activeQuestions = questions?.data?.filter((q: any) => q.is_active);

  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row p-4 bg-white items-start md:items-center justify-between gap-2">
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center w-full md:w-auto">
            <div className="text-md w-32 font-bold text-[#085E9C]">
              الأسئلة المنشورة
            </div>
            <div className="relative w-full md:w-48 border rounded-md border-[#085E9C]">
              <input
                type="text"
                placeholder="ابحث بالسؤال"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-8 pr-4 border border-gray-300 rounded-md focus:outline-none"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-500" />
            </div>
          </div>

          {/* Add Question Button */}
          <div className="flex items-center mt-2 md:mt-0">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-[#085E9C] border border-[#085E9C] px-4 py-2 rounded text-sm font-medium transition-colors"
              onClick={() => setShowPriceModal(true)}
            >
              إضافة سؤال
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#085E9C] bg-white text-sm min-w-[700px] md:min-w-full">
            <thead className="text-center">
              <tr className="px-4 py-2 font-medium text-[#085E9C]">
                <th className="px-4 w-auto py-2 font-medium">رقم</th>
                <th className="px-4 py-2 font-medium">أسم الفئة</th>
                <th className="px-4 py-2 font-medium">السؤال</th>
                <th className="px-4 py-2 font-medium">الجواب</th>
                <th className="px-4 py-2 font-medium">النقاط</th>
                <th className="px-4 py-2 font-medium">التلميح</th>
                <th className="px-4 py-2 font-medium">مشرف الفئة</th>
                <th className="px-4 py-2 font-medium">إدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y text-center divide-gray-200">
              {activeQuestions?.length > 0 ? (
                activeQuestions.map((question: any, index: number) => (
                  <ProductRow
                    key={question.id}
                    product={question}
                    index={index}
                    setShowPriceModal={setShowPriceModal}
                    handleConfirmStatus={() => handleConfirmStatus(question)}
                    setSelectedImg={setSelectedImg}
                    setSelectedId={setSelectedId}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-2 text-gray-700">
                    لم يتم العثور على أسئلة منشورة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Image Modal */}
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

        {/* Add/Edit Question Modal */}
        <CustomModal isOpen={showPriceModal}>
          <AddQuestion
            selectedId={selectedId}
            onClose={() => setShowPriceModal(false)}
          />
        </CustomModal>
      </div>
    </div>
  );
};

export default PostedQuestions;
