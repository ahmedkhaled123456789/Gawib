import { useRef, useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Dropdown from "../../components/DropDown";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import {
  createQuestion,
  updateQuestion,
  getQuestionById,
} from "../../store/questionsSlice";
import { getAllGamesForDropdown } from "../../store/gameSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type FileData =
  | { type: "image" | "audio" | "video"; url: string }
  | File
  | null;

const AddQuestion = ({
  selectedId,
  onClose,
}: {
  selectedId?: string;
  onClose: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [activePoints, setActivePoints] = useState<number>(400);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [cat, setCat] = useState("");
  const [age, setAge] = useState("");
  const [see, setSee] = useState("");

  const [questionFile, setQuestionFile] = useState<FileData>(null);
  const [answerFile, setAnswerFile] = useState<FileData>(null);
  const [loading, setLoading] = useState(false);

  const [selectedGame, setSelectedGame] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [isActive, setIsActive] = useState(false);

  const [gameOptions, setGameOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // **حفظ النص الأصلي**
  const [originalQuestion, setOriginalQuestion] = useState("");
  const [originalAnswer, setOriginalAnswer] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef2 = useRef<HTMLInputElement | null>(null);

  const { games } = useSelector((state: RootState) => state.game);

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

  useEffect(() => {
    if (selectedId && gameOptions.length) {
      dispatch(getQuestionById(selectedId))
        .unwrap()
        .then((data) => {
          setActivePoints(Number(data.data.points) || 0);

          const questionText = data.data.question.text || "";
          const answerText = data.data.answer.text || "";

          setOriginalQuestion(questionText);
          setOriginalAnswer(answerText);

          setQuestion(questionText);
          setAnswer(answerText);
          setSee(data.data.hint || "");
          setCat(questionText);

          // ملف السؤال
          if (data.data.question?.video) {
            setQuestionFile({ type: "video", url: data.data.question.video });
          } else if (data.data.question?.audio) {
            setQuestionFile({ type: "audio", url: data.data.question.audio });
          } else if (data.data.question?.image) {
            setQuestionFile({ type: "image", url: data.data.question.image });
          } else {
            setQuestionFile(null);
          }

          // ملف الجواب
          if (data.data.answer?.video) {
            setAnswerFile({ type: "video", url: data.data.answer.video });
          } else if (data.data.answer?.audio) {
            setAnswerFile({ type: "audio", url: data.data.answer.audio });
          } else if (data.data.answer?.image) {
            setAnswerFile({ type: "image", url: data.data.answer.image });
          } else {
            setAnswerFile(null);
          }

          const gameObj = gameOptions.find(
            (g) => g.value === data.data.game_id
          );
          setSelectedGame(gameObj || null);

          setIsActive(Boolean(data.data.is_active));
        })
        .catch(() => {
          toast.error("فشل تحميل بيانات السؤال");
        });
    }
  }, [selectedId, gameOptions, dispatch]);
  // Helper لتحويل URL إلى ملف (Blob)
  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const handleSubmit = async () => {
    if (!question.trim() || !answer.trim() || !selectedGame) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const formData = new FormData();
    formData.append("points", activePoints.toString());
    formData.append("game_id", selectedGame ? selectedGame.value : "");
    formData.append("hint", see);
    formData.append("activeCategory", age);
    formData.append("is_active", isActive ? "1" : "0");

    // إرسال النص فقط إذا تغير
    if (question.trim() && question !== originalQuestion) {
      formData.append("question_text", question);
    }
    if (answer.trim() && answer !== originalAnswer) {
      formData.append("answer_text", answer);
    }

    // === ملفات السؤال ===
    if (questionFile instanceof File) {
      if (questionFile.type.startsWith("image/")) {
        formData.append("question_image", questionFile);
      } else if (questionFile.type.startsWith("audio/")) {
        formData.append("question_audio", questionFile);
      } else if (questionFile.type.startsWith("video/")) {
        formData.append("question_video", questionFile);
      }
    } else if (questionFile && "url" in questionFile) {
      // تحويل URL إلى File
      const file = await urlToFile(
        questionFile.url,
        `question_${questionFile.type}`
      );
      if (questionFile.type === "image") {
        formData.append("question_image", file);
      } else if (questionFile.type === "audio") {
        formData.append("question_audio", file);
      } else if (questionFile.type === "video") {
        formData.append("question_video", file);
      }
    }

    // === ملفات الجواب ===
    if (answerFile instanceof File) {
      if (answerFile.type.startsWith("image/")) {
        formData.append("answer_image", answerFile);
      } else if (answerFile.type.startsWith("audio/")) {
        formData.append("answer_audio", answerFile);
      } else if (answerFile.type.startsWith("video/")) {
        formData.append("answer_video", answerFile);
      }
    } else if (answerFile && "url" in answerFile) {
      const file = await urlToFile(answerFile.url, `answer_${answerFile.type}`);
      if (answerFile.type === "image") {
        formData.append("answer_image", file);
      } else if (answerFile.type === "audio") {
        formData.append("answer_audio", file);
      } else if (answerFile.type === "video") {
        formData.append("answer_video", file);
      }
    }

    setLoading(true);

    try {
      if (selectedId) {
        formData.append("_method", "PUT");
        await dispatch(updateQuestion({ id: selectedId, formData })).unwrap();
        toast.success("تم التحديث بنجاح!");
      } else {
        await dispatch(createQuestion(formData)).unwrap();
        toast.success("تم الحفظ بنجاح!");
      }
      resetHandle();
      onClose();
    } catch (err) {
      toast.error(err || "حدث خطأ أثناء الحفظ!");
    } finally {
      setLoading(false);
    }
  };

  const resetHandle = () => {
    setQuestion("");
    setAnswer("");
    setAge("");
    setSee("");
    setCat("");
    setQuestionFile(null);
    setAnswerFile(null);
    setSelectedGame(null);
    setIsActive(false);
    setOriginalQuestion("");
    setOriginalAnswer("");
  };

  const handleQuestionFileClick = () => fileInputRef.current?.click();
  const handleAnswerFileClick = () => fileInputRef2.current?.click();

  const handleQuestionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setQuestionFile(file);
  };

  const handleAnswerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAnswerFile(file);
  };

  const renderFilePreview = (file: FileData) => {
    if (!file)
      return (
        <img
          src="/images/group/img.png"
          alt="Placeholder"
          className="w-[60px] h-[60px]"
        />
      );

    if (file && typeof file === "object" && "url" in file) {
      if (file.type === "video") {
        return (
          <video
            controls
            style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
          >
            <source src={file.url} type="video/mp4" />
          </video>
        );
      }
      if (file.type === "audio") {
        return (
          <audio controls>
            <source src={file.url} />
          </audio>
        );
      }
      if (file.type === "image") {
        return (
          <img src={file.url} alt="Preview" className="w-[70px] h-[70px]" />
        );
      }
    }

    if (file instanceof File) {
      if (file.type.startsWith("image/")) {
        return (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-[60px] h-[60px]"
          />
        );
      }
      if (file.type.startsWith("audio/")) {
        return (
          <audio controls>
            <source src={URL.createObjectURL(file)} type={file.type} />
          </audio>
        );
      }
      if (file.type.startsWith("video/")) {
        return (
          <video controls width="60" height="60">
            <source src={URL.createObjectURL(file)} type={file.type} />
          </video>
        );
      }
    }

    return null;
  };

  return (
    <div className="w-[100%] max-w-[1200px] p-5 mx-auto">
      <div className="bg-white rounded-md p-6 border shadow-lg">
        <div className="flex gap-4">
          <div className="w-[200px] flex flex-col justify-between gap-2">
            <div className="flex justify-between">
              {[200, 400, 600].map((point) => (
                <button
                  key={point}
                  onClick={() => setActivePoints(point)}
                  className={`w-14 h-10 border rounded ${
                    activePoints === point ? "bg-[#085E9C] text-white" : ""
                  }`}
                >
                  {point}
                </button>
              ))}
            </div>

            <label className="text-[#085E9C] font-bold">اختر اللعبة</label>
            <Dropdown
              options={gameOptions}
              selected={selectedGame?.value || ""}
              onChange={(value) => {
                const option =
                  gameOptions.find((opt) => opt.value === value) || null;
                setSelectedGame(option);
              }}
            />

            <label className="text-[#085E9C] font-bold">الفئة النشطة</label>
            <div className="border border-[#085E9C] flex items-center justify-between px-2 py-3 rounded text-sm text-right">
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full outline-none text-sm text-right"
              />
              {age && (
                <span
                  className="text-red-500 text-xl cursor-pointer"
                  onClick={() => setAge("")}
                >
                  ✖
                </span>
              )}
            </div>

            <label className="text-[#085E9C] font-bold">السؤال النشط</label>
            <div className="border border-[#085E9C] flex items-center justify-between px-2 py-3 rounded text-sm text-right">
              <input
                type="text"
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full outline-none text-sm text-right"
              />
              {cat && (
                <span
                  className="text-red-500 text-xl cursor-pointer"
                  onClick={() => setCat("")}
                >
                  ✖
                </span>
              )}
            </div>

            <label className="text-[#085E9C] font-bold">التلميح</label>
            <input
              type="text"
              value={see}
              onChange={(e) => setSee(e.target.value)}
              className="w-full rounded outline-none border border-[#085E9C] p-3 text-sm text-right"
            />

            <label className="text-[#085E9C] font-semibold text-xl flex items-center gap-x-2">
              منشط
              <input
                className="w-4 h-4"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </label>

            <div className="flex justify-between gap-2 pt-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 rounded p-2 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#085E9C] text-white"
                }`}
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "حفظ"}
              </button>

              <button
                onClick={resetHandle}
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

          <div className="flex flex-1 justify-between gap-4">
            {/* السؤال */}
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
                  onClick={handleQuestionFileClick}
                >
                  {renderFilePreview(questionFile)}
                </div>
                <input
                  type="file"
                  accept="image/*,audio/*,video/*"
                  ref={fileInputRef}
                  onChange={handleQuestionFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* الجواب */}
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
                  onClick={handleAnswerFileClick}
                >
                  {renderFilePreview(answerFile)}
                </div>
                <input
                  type="file"
                  accept="image/*,audio/*,video/*"
                  ref={fileInputRef2}
                  onChange={handleAnswerFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;
