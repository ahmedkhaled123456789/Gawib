import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dropdown from "../../components/DropDown";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { createQuestion, updateQuestion, getQuestionById } from "../../store/questionsSlice"; // نفترض عندك API تجيب سؤال واحد

const AddQuestion = ({ selectedId, onClose }: { selectedId?: string; onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [activePoints, setActivePoints] = useState<number | null>(400);
   const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [cat, setCat] = useState("");
  const [age, setAge] = useState("");
  const [see, setSee] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef2 = useRef<HTMLInputElement | null>(null);

  // 🔹 جلب البيانات لو في selectedId
  useEffect(() => {
    if (selectedId) {
      dispatch(getQuestionById(selectedId))
        .unwrap()
        .then((data) => {
          setActivePoints(Number(data.data.points) || 0);
           setQuestion(data.data.question.text || "");
          setAnswer(data.data.answer.text || "");
          setSee(data.data.hint || "");
           setCat(data.data.question.text || "");
        setImage(data.data.question?.image || null);
        setImage2(data.data.answer?.image || null);
        })
        .catch(() => {
          toast.error("فشل تحميل بيانات السؤال");
        });
    }
  }, [selectedId, dispatch]);

const handleSubmit = () => {
  const formData = new FormData();
  formData.append("points", activePoints?.toString() || "0");
  formData.append("game_id", "1");
  formData.append("question.text", question);
  if (image) formData.append("question.image", image);
  formData.append("answer.text", answer);
  if (image2) formData.append("answer.image", image2);
  formData.append("hint", see);
  formData.append("activeCategory", age);
  formData.append("is_active", "0");
  if (selectedId) formData.append("_method", "PUT");
  if (selectedId){
    dispatch(updateQuestion({ id: selectedId, formData }))
  .unwrap()
  .then(() => {
    toast.success(selectedId ? "تم التحديث بنجاح!" : "تم الحفظ بنجاح!");
    resetHandle();
    onClose();
  })
  .catch((err) => {
    toast.error(err || (selectedId ? "فشل التحديث!" : "فشل الحفظ!"));
  });
  }else{
    dispatch(createQuestion(formData))
  .unwrap()
  .then(() => {
    toast.success(selectedId ? "تم التحديث بنجاح!" : "تم الحفظ بنجاح!");
    resetHandle();
    onClose();
  })
  .catch((err) => {
    toast.error(err || (selectedId ? "فشل التحديث!" : "فشل الحفظ!"));
  });
  }
 


};



  const resetHandle = () => {
     setQuestion("");
    setAnswer("");
    setAge("");
    setSee("");
    setCat("");
    setImage(null);
    setImage2(null);
  };

  const handleImageClick = () => fileInputRef.current?.click();
  const handleImageClick2 = () => fileInputRef2.current?.click();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };
  const handleImageChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage2(file);
  };
  return (
    <div className="w-full p-5">
      <div className="bg-white rounded-md p-4 border shadow">
        <div className="flex gap-4">
           {/* الجانب الأيمن */}
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

             {/* Dropdown */}
             <label className="text-[#085E9C] font-bold" >أسم الفئة</label>
        <Dropdown
  options={[
    { value: "", label: "دول وعواصم  " },
    { value: "فن أجنبي  ", label: "فن أجنبي" },
    { value: " خمن الصورة ", label: " خمن الصورة " },
  ]}
  selected={statusFilter}
  onChange={setStatusFilter}
/>

            {/* الفئة النشطة */}
            <label className="text-[#085E9C] font-bold" >الفئة النشطة</label>
            <div className="border  border-[#085E9C] flex items-center justify-between px-2 py-3 rounded text-sm text-right">
 <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
               className="w-full  outline-none   text-sm text-right"
            />  
                 {age&&(
 <span className="text-red-500 text-xl cursor-pointer">
                <img onClick={() =>setAge("") } src="/images/group/close.png" alt="" className="w-5 h-5" />
              </span>
                 )}       
             
            </div>

            {/* السؤال النشط */}
            <label className="text-[#085E9C] font-bold" >السؤال النشط</label>
            <div className="border  border-[#085E9C] flex items-center justify-between px-2 py-3 rounded text-sm text-right">
                <input
              type="text"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
               className="w-full  outline-none   text-sm text-right"
            />
              {cat&&(
 <span className="text-red-500 text-xl cursor-pointer">
                <img onClick={() =>setCat("") } src="/images/group/close.png" alt="" className="w-5 h-5" />
              </span>
                 )}    
            </div>

            {/* التلميح */}
            <label className="text-[#085E9C] font-bold" >التلميح</label>
            <input
              type="text"
              value={see}
              onChange={(e) => setSee(e.target.value)}
               className="w-full rounded outline-none  border  border-[#085E9C] p-3 text-sm text-right"
            />

            {/* الأزرار */}
            <div className="flex justify-between gap-2 pt-2">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#085E9C] text-white rounded p-2"
              >
                حفظ
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
          {/* السؤال والجواب */}
          <div className="flex flex-1 justify-between gap-4">
            

            {/* السؤال */}
            <div className="flex flex-col w-1/2 border  border-[#085E9C] p-2 rounded">
              <h3 className="text-center border p-4  border-[#085E9C] font-bold text-[#085E9C]  mb-2">السؤال</h3>
<input
  type="text"
  value={question }
  onChange={(e) => setQuestion(e.target.value)}
  className="border p-4 focus:outline-none border-[#085E9C] mb-2 text-right w-full"
  placeholder="مصر"
/>              <div className="border p-4  border-[#085E9C] flex justify-center items-center h-72">
 <div
                className="w-full h-[200px]    flex items-center justify-center cursor-pointer  "
                onClick={handleImageClick}
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-[60px] h-[60px] "
                  />
                ) : (
                  <img src="/images/group/img.png" alt="Placeholder" className="w-[60px] h-[60px]" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />              </div>
            </div>
            {/* الجواب */}
            <div className=" flex flex-col w-1/2 border   border-[#085E9C]  p-2 rounded">
              <h3 className="text-center font-bold text-[#085E9C] border p-4  border-[#085E9C]  mb-2">الجواب</h3>
<input
  type="text"
  value={answer }
  onChange={(e) => setAnswer(e.target.value)}
  className="border p-4 focus:outline-none border-[#085E9C] mb-2 text-right w-full"
  placeholder="القاهرة"
/>
              <div className="border p-4  border-[#085E9C] flex justify-center items-center h-72">
 <div
                className="w-full h-[200px]    flex items-center justify-center cursor-pointer  "
                onClick={handleImageClick2}
              >
                {image2 ? (
                  <img
                    src={URL.createObjectURL(image2)}
                    alt="Preview"
                    className="w-[60px] h-[60px] "
                  />
                ) : (
                  <img src="/images/group/img.png" alt="Placeholder" className="w-[60px] h-[60px]" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef2}
                onChange={handleImageChange2}
                className="hidden"
              />              </div>
            </div>
          </div>

         
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddQuestion;
