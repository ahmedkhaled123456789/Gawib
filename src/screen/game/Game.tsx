import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import Pagination from "../../components/pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getFreeGames } from "../../store/GameFreeSlic";
import { deleteQuestion } from "../../store/questionsSlice";
import { toast } from "sonner";
import { TrashIcon, PlusCircle, EditIcon } from "lucide-react";
import AddQuestion from "./AddQuestion";
import EditQuestion from "./EditeQuestion";
import CustomModal from "../../components/Modals/CustomModal";

const ProductRow = ({ game, refreshData, onEdit }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = (questionId: string) => {
    toast("هل تريد حذف هذا السؤال؟", {
      action: {
        label: "حذف",
        onClick: async () => {
          try {
            await dispatch(deleteQuestion(questionId)).unwrap();
            toast.success("تم حذف السؤال بنجاح");
            refreshData();
          } catch (error) {
            toast.error("حدث خطأ أثناء الحذف");
          }
        },
      },
    });
  };

  if (!game.questions || game.questions.length === 0) return null;

  return (
    <>
      {game.questions.map((question) => (
        <tr key={question.id} className="text-center">
          <td className="px-4 py-2">{question.id}</td>
          <td className="px-4 py-2">{game.name}</td>
          <td className="px-4 py-2">{question.question_text || ""}</td>
          <td className="px-4 py-2">{question.answer_text || ""}</td>
          <td className="px-4 py-2">{question.points}</td>
          <td className="px-4 py-2">{question.hint}</td>
          <td className="px-4 py-2">{game.admin?.name || ""}</td>
          <td className="p-3">
            {question.is_active ? (
              <span className="text-green-600 font-semibold">نشط</span>
            ) : (
              <span className="text-red-500 font-semibold">غير نشط</span>
            )}
          </td>
          <td className="px-4 py-2 flex justify-center gap-3">
            <TrashIcon
              className="cursor-pointer text-red-500"
              onClick={() => handleDelete(question.id)}
            />

            <button
              onClick={() => onEdit(question.id)}
              className="bg-[#085E9C] text-white  hover:bg-[#0a6bb9] p-1 rounded-sm  font-semibold"
            >
            <EditIcon/>
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

const Game = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { gameFree } = useSelector((state: RootState) => state.freeGame);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const refreshData = async () => {
    await dispatch(getFreeGames(page));
  };

  useEffect(() => {
    refreshData();
  }, [dispatch, page]);

  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
        <div className="flex flex-wrap p-4 bg-white items-center justify-between gap-4">
          <div className="flex gap-4 items-center">
            <div className="text-md font-bold text-[#085E9C]">
              اللعبة المجانية
            </div>

            <div className="relative w-full md:w-48 border rounded-md border-[#085E9C]">
              <input
                type="text"
                placeholder="بحث"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-8 pr-4 border border-gray-300 rounded-md focus:outline-none"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-500" />
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#085E9C] text-white px-4 py-2 rounded-lg hover:bg-[#0a74c4] transition"
          >
            <PlusCircle size={18} />
            إضافة سؤال جديد
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y-2 divide-[#085E9C] bg-white text-sm">
            <thead className="text-center">
              <tr className="px-4 py-2 font-medium text-[#085E9C]">
                <th>ID</th>
                <th>اسم اللعبة</th>
                <th>السؤال</th>
                <th>الجواب</th>
                <th>النقاط</th>
                <th>التلميح</th>
                <th>مشرف الفئة</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody className="divide-y text-center divide-gray-200">
              {gameFree?.data?.length > 0 ? (
                gameFree.data
                  .filter((game) => game.questions?.length > 0)
                  .filter((game) => {
                    if (!searchQuery.trim()) return true;
                    const query = searchQuery.toLowerCase();
                    return (
                      game.name.toLowerCase().includes(query) ||
                      game.questions.some(
                        (q) =>
                          q.question_text?.toLowerCase().includes(query) ||
                          q.answer_text?.toLowerCase().includes(query)
                      )
                    );
                  })
                  .map((game) => (
                    <ProductRow
                      key={game.id}
                      game={game}
                      refreshData={refreshData}
                      onEdit={(id) => {
                        setSelectedId(id);
                        setShowEditModal(true);
                      }}
                    />
                  ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-2 text-gray-700">
                    {gameFree
                      ? "لم يتم العثور على ألعاب مجانية تحتوي على أسئلة."
                      : "لا توجد بيانات."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {gameFree?.meta?.last_page && (
        <Pagination pageCount={gameFree.meta.last_page} onPress={setPage} />
      )}

      {/* Add Modal */}
      <CustomModal isOpen={showAddModal}>
        <AddQuestion onClose={() => setShowAddModal(false)} />
      </CustomModal>

      {/* Edit Modal */}
      <CustomModal isOpen={showEditModal}>
        <EditQuestion
          selectedId={selectedId as string}
          onClose={() => {
            refreshData();
            setSelectedId(null);
            setShowEditModal(false);
          }}
        />
      </CustomModal>
    </div>
  );
};

export default Game;
