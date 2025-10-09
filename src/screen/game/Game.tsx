import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import CustomDropdown from "../../components/CustomDropdown";
import Pagination from "../../components/pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getGameFree, deleteGame } from "../../store/gameSlice";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";

const ProductRow = ({ game }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = () => {
    toast("هل تريد حذف هذه اللعبة؟", {
      action: {
        label: "حذف",
        onClick: async () => {
          try {
            await dispatch(deleteGame(game.id)).unwrap();
            toast.success("تم حذف اللعبة بنجاح");
          } catch (error) {
            toast.error("حدث خطأ أثناء الحذف");
          }
        },
      },
    });
  };

  return (
    <>
      {game.questions.map((question) => (
        <tr key={question.id} className="text-center">
          <td className="px-4 py-2">{question.id}</td>
          <td className="px-4 py-2">{game.name}</td>
          <td className="px-4 py-2">
            {question.question?.text || ""}
            {question.question?.image && (
              <img
                src={question.question.image}
                alt="question"
                className="w-20 h-20 object-cover mx-auto mt-1"
              />
            )}
          </td>
          <td className="px-4 py-2">
            {question.answer?.text || ""}
            {question.answer?.image && (
              <img
                src={question.answer.image}
                alt="answer"
                className="w-20 h-20 object-cover mx-auto mt-1"
              />
            )}
          </td>
          <td className="px-4 py-2">{question.points}</td>
          <td className="px-4 py-2">{question.hint}</td>
          <td className="px-4 py-2">{game.admin?.name || ""}</td>
          {/* عمود الإجراءات */}
          <td className="px-4 py-2">
            <TrashIcon
              className="cursor-pointer text-red-500"
              onClick={handleDelete}
            />
          </td>
        </tr>
      ))}
    </>
  );
};

const Game = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { gameFree, loading, error } = useSelector(
    (state: RootState) => state.game
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(getGameFree(1));
  }, [dispatch]);

  const onPress = async (page) => {
    await dispatch(getGameFree(page));
  };

  if (loading) {
    return <div className="text-center p-4">جاري تحميل البيانات...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">حدث خطأ: {error}</div>;
  }

  return (
    <div className="overflow-x-hidden">
      <div className="mx-2">
        {/* Header */}
        <div className="flex p-4 bg-white md:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 items-center w-full md:w-auto">
            <div className="text-md ml-16 font-bold text-[#085E9C]">
              اللعبة المجانية
            </div>

            {/* Search */}
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

            {/* Dropdown */}
            <CustomDropdown
              options={[
                { value: "", label: "الأحدث" },
                { value: "الفئة", label: "الفئة" },
                { value: "المشرف", label: "المشرف" },
              ]}
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
                <th>ID</th>
                <th>اسم اللعبة</th>
                <th>السؤال</th>
                <th>الجواب</th>
                <th>النقاط</th>
                <th>التلميح</th>
                <th>مشرف الفئة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody className="divide-y text-center divide-gray-200">
              {gameFree?.data?.length > 0 ? (
                gameFree.data.map((game) => (
                  <ProductRow key={game.id} game={game} />
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-2 text-gray-700">
                    {gameFree
                      ? "لم يتم العثور على ألعاب مجانية."
                      : "لا توجد بيانات."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {gameFree?.meta?.last_page && (
        <Pagination pageCount={gameFree.meta.last_page} onPress={onPress} />
      )}
    </div>
  );
};

export default Game;
