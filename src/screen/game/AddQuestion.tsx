import React, { useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { createQuestion } from "../../store/questionsSlice";
import { getAllGamesForDropdown } from "../../store/gameSlice";
import Dropdown from "../../components/DropDown";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type FileData = {
  file: File;
  url: string;
} | null;

interface Props {
  onClose: () => void;
}

const AddQuestion: React.FC<Props> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { games } = useSelector((s: RootState) => s.game);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [hint, setHint] = useState("");
  const [points, setPoints] = useState<number>(400);
  const [activeCategory, setActiveCategory] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const [questionFile, setQuestionFile] = useState<FileData>(null);
  const [answerFile, setAnswerFile] = useState<FileData>(null);
  const [selectedGame, setSelectedGame] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [gameOptions, setGameOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const fileInputRefQ = useRef<HTMLInputElement | null>(null);
  const fileInputRefA = useRef<HTMLInputElement | null>(null);

  // Load games for dropdown - تحسين الشرط
  React.useEffect(() => {
    // التحقق من وجود بيانات الألعاب المجانية فقط
    const hasFreeGames = games?.data?.some((g: any) => g.is_free);
    
    if (!hasFreeGames) {
      dispatch(getAllGamesForDropdown());
    }
  }, [dispatch, games]); // إضافة games إلى dependencies

  React.useEffect(() => {
    if (games?.data) {
      setGameOptions(
        games.data
          .filter((g: any) => g.is_free) // تصفية فقط الألعاب المجانية
          .map((g: any) => ({
            value: g.id,
            label: `🆓🆓  ${g.name}`, // إضافة رمز المجانية
          })) || []
      );
    }
  }, [games]);

  // باقي الكود بدون تغيير...
  // File selection handler
  const handleFileSelect = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      setFile: (f: FileData) => void
    ) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setFile({ file, url });
      }
    },
    []
  );

  // Cleanup URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (questionFile?.url) {
        URL.revokeObjectURL(questionFile.url);
      }
      if (answerFile?.url) {
        URL.revokeObjectURL(answerFile.url);
      }
    };
  }, [questionFile?.url, answerFile?.url]);

  // Render preview
  const renderFilePreview = useCallback((fileData: FileData) => {
    if (!fileData)
      return (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <img
            src="/images/group/img.png"
            alt="Placeholder"
            className="w-24 h-24 opacity-60"
          />
          <p className="text-sm mt-2">اضغط لاختيار ملف</p>
        </div>
      );

    const { file, url } = fileData;
    const type = file.type;

    if (type.startsWith("image"))
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-50 rounded-lg shadow-md overflow-hidden">
          <img
            src={url}
            alt="Preview"
            className="max-h-[260px] object-contain rounded-lg"
          />
        </div>
      );

    if (type.startsWith("video"))
      return (
        <div className="relative w-full flex justify-center bg-gray-100 rounded-lg shadow-md overflow-hidden">
          <video src={url} controls className="max-h-[260px] rounded-lg" />
        </div>
      );

    if (type.startsWith("audio"))
      return (
        <div className="w-full bg-gray-100 rounded-lg shadow-md p-4 flex flex-col items-center">
          <audio controls className="w-full max-w-[300px]">
            <source src={url} type={type} />
          </audio>
          <p className="text-sm text-gray-600 mt-2">🎧 تشغيل الصوت</p>
        </div>
      );

    return null;
  }, []);

  // reset form - إزالة إعادة تعيين النقاط
  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setHint("");
    // تنظيف الـ URLs القديمة
    if (questionFile?.url) {
      URL.revokeObjectURL(questionFile.url);
    }
    if (answerFile?.url) {
      URL.revokeObjectURL(answerFile.url);
    }
    setQuestionFile(null);
    setAnswerFile(null);
    setActiveCategory("");
    // تم إزالة setSelectedGame(null) - الفئة تبقى كما هي
    setIsActive(false);
  };

  // Build FormData helper
  const appendFileToForm = (
    fd: FormData,
    fileData: FileData,
    prefix: string
  ) => {
    if (!fileData) return;
    const { file } = fileData;
    if (file.type.startsWith("image/")) fd.append(`${prefix}_image`, file);
    else if (file.type.startsWith("audio/")) fd.append(`${prefix}_audio`, file);
    else if (file.type.startsWith("video/")) fd.append(`${prefix}_video`, file);
  };

  // Submit (create only)
  const submitQuestion = async () => {
    if (!question.trim() || !answer.trim() || !selectedGame) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const formData = new FormData();
    formData.append("points", points.toString());
    formData.append("game_id", selectedGame.value);
    formData.append("hint", hint);
    formData.append("activeCategory", activeCategory);
    formData.append("is_active", isActive ? "1" : "0");
    formData.append("question_text", question);
    formData.append("answer_text", answer);

    appendFileToForm(formData, questionFile, "question");
    appendFileToForm(formData, answerFile, "answer");

    setLoading(true);

    dispatch(createQuestion(formData))
      .unwrap()
      .then(() => {
        toast.success("تم الحفظ بنجاح!");
        resetForm(); // إعادة تعيين النموذج مع الاحتفاظ بالنقاط والفئة
      })
      .catch((err) => {
        console.error(err);
        toast.error(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full max-w-[1200px] p-5 mx-auto">
      <div className="bg-white rounded-md p-6 border shadow-lg flex gap-4">
        {/* Sidebar */}
        <div className="w-[200px] flex flex-col gap-3">
          <div className="flex justify-between">
            {[200, 400, 600].map((p) => (
              <button
                key={p}
                onClick={() => setPoints(p)}
                className={`w-14 h-10 border rounded ${
                  points === p ? "bg-[#085E9C] text-white" : ""
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <label className="text-[#085E9C] font-bold">اختر الفئه</label>
          <Dropdown
            options={gameOptions}
            selected={selectedGame?.value || ""}
            onChange={(value) =>
              setSelectedGame(
                gameOptions.find((g) => g.value === value) || null
              )
            }
          />

          <label className="text-[#085E9C] font-bold">الفئة النشطة</label>
          <input
            type="text"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="border border-[#085E9C] rounded p-2 text-right"
          />

          <label className="text-[#085E9C] font-bold">التلميح</label>
          <input
            type="text"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            className="border border-[#085E9C] rounded p-2 text-right"
          />

          <label className="flex items-center gap-2 text-[#085E9C] font-semibold text-lg">
            منشط
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </label>

          <div className="flex gap-2 pt-2">
            <button
              onClick={submitQuestion}
              disabled={loading}
              className={`flex-1 rounded p-2 ${
                loading ? "bg-gray-400" : "bg-[#085E9C] text-white"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                "حفظ"
              )}
            </button>

            <button
              onClick={resetForm}
              className="flex-1 bg-[#ff426e] text-white rounded p-2"
            >
              إلغاء
            </button>

            <button
              onClick={onClose}
              className="flex-1 border border-[#085E9C] text-[#085E9C] rounded p-2"
            >
              إغلاق
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex gap-4">
          {/* Question */}
          <div className="flex flex-col w-1/2 border border-[#085E9C] p-2 rounded">
            <h3 className="text-center border p-4 border-[#085E9C] font-bold text-[#085E9C] mb-2">
              السؤال
            </h3>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="border p-4 focus:outline-none border-[#085E9C] mb-2 text-right w-full"
              placeholder="اكتب السؤال"
            />
            <div className="border p-4 border-[#085E9C] flex justify-center items-center h-72">
              <div
                className="w-full h-[200px] flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRefQ.current?.click()}
              >
                {renderFilePreview(questionFile)}
              </div>
              <input
                type="file"
                accept="image/*,audio/*,video/*"
                ref={fileInputRefQ}
                onChange={(e) => handleFileSelect(e, setQuestionFile)}
                className="hidden"
              />
            </div>
          </div>

          {/* Answer */}
          <div className="flex flex-col w-1/2 border border-[#085E9C] p-2 rounded">
            <h3 className="text-center font-bold text-[#085E9C] border p-4 border-[#085E9C] mb-2">
              الجواب
            </h3>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="border p-4 focus:outline-none border-[#085E9C] mb-2 text-right w-full"
              placeholder="اكتب الجواب"
            />
            <div className="border p-4 border-[#085E9C] flex justify-center items-center h-72">
              <div
                className="w-full h-[200px] flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRefA.current?.click()}
              >
                {renderFilePreview(answerFile)}
              </div>
              <input
                type="file"
                accept="image/*,audio/*,video/*"
                ref={fileInputRefA}
                onChange={(e) => handleFileSelect(e, setAnswerFile)}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;