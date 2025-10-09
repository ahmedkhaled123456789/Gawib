// src/components/questions/EditQuestion.tsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { updateQuestion, getQuestionById } from "../../store/questionsSlice";
import { getAllGamesForDropdown } from "../../store/gameSlice";
import Dropdown from "../../components/DropDown";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type FileData =
  | { type: "image" | "audio" | "video"; url: string }
  | File
  | null;

interface Props {
  selectedId: string;
  onClose: () => void;
}

const EditQuestion: React.FC<Props> = ({ selectedId, onClose }) => {
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

  // Load games for dropdown
  useEffect(() => {
    dispatch(getAllGamesForDropdown());
  }, [dispatch]);

  useEffect(() => {
    if (games) {
      setGameOptions(
        games.data?.map((g: any) => ({ value: g.id, label: g.name })) || []
      );
    }
  }, [games]);

  // Load question data when editing
  useEffect(() => {
    if (!selectedId) return;

    setLoading(true);
    dispatch(getQuestionById(selectedId))
      .unwrap()
      .then((res) => {
        const data = res.data;
        setQuestion(data.question_text || data.question?.text || "");
        setAnswer(data.answer_text || "");
        setHint(data.hint || "");
        setPoints(Number(data.points) || 400);
        setIsActive(Boolean(data.is_active));
        setActiveCategory(data.activeCategory || "");

        setQuestionFile(
          data.question?.video
            ? { url: data.question.video, type: "video" }
            : data.question?.image
            ? { url: data.question.image, type: "image" }
            : data.question?.audio
            ? { url: data.question.audio, type: "audio" }
            : null
        );

        setAnswerFile(
          data.answer?.video
            ? { url: data.answer.video, type: "video" }
            : data.answer?.image
            ? { url: data.answer.image, type: "image" }
            : data.answer?.audio
            ? { url: data.answer.audio, type: "audio" }
            : null
        );

        const sel = (games?.data || []).find((g: any) => g.id === data.game_id);
        setSelectedGame(sel ? { value: sel.id, label: sel.name } : null);
      })
      .catch(() => toast.error("فشل تحميل بيانات السؤال"))
      .finally(() => setLoading(false));
  }, [selectedId, dispatch, games]);

  // File selection handler
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: FileData) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  // Render preview
  const renderFilePreview = (file: FileData) => {
    if (!file)
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

    const src = file instanceof File ? URL.createObjectURL(file) : file.url;
    const type = file instanceof File ? file.type : file.type;

    if (type.startsWith("image"))
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-50 rounded-lg shadow-md overflow-hidden">
          <img
            src={src}
            alt="Preview"
            className="max-h-[260px] object-contain rounded-lg"
          />
        </div>
      );

    if (type.startsWith("video"))
      return (
        <div className="relative w-full flex justify-center bg-gray-100 rounded-lg shadow-md overflow-hidden">
          <video src={src} controls className="max-h-[260px] rounded-lg" />
        </div>
      );

    if (type.startsWith("audio"))
      return (
        <div className="w-full bg-gray-100 rounded-lg shadow-md p-4 flex flex-col items-center">
          <audio controls className="w-full max-w-[300px]">
            <source src={src} type={type} />
          </audio>
          <p className="text-sm text-gray-600 mt-2">🎧 تشغيل الصوت</p>
        </div>
      );

    return null;
  };

  // reset form
  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setHint("");
    setPoints(400);
    setActiveCategory("");
    setQuestionFile(null);
    setAnswerFile(null);
    setSelectedGame(null);
    setIsActive(false);
  };

  // Build FormData helper
  const appendFileToForm = (fd: FormData, file: FileData, prefix: string) => {
    if (!(file instanceof File)) return;
    if (file.type.startsWith("image/")) fd.append(`${prefix}_image`, file);
    else if (file.type.startsWith("audio/")) fd.append(`${prefix}_audio`, file);
    else if (file.type.startsWith("video/")) fd.append(`${prefix}_video`, file);
  };

  // Submit (update only)
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

    // Update branch (use _method=PUT if backend expects it via POST)
    formData.append("_method", "PUT");

    setLoading(true);

    dispatch(updateQuestion({ id: selectedId, formData }))
      .unwrap()
      .then(() => {
        toast.success("تم التحديث بنجاح!");
        onClose();
      })
      .catch((err) => {
        console.error(err);
        toast.error("فشل التحديث!");
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
                "تحديث"
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

export default EditQuestion;
