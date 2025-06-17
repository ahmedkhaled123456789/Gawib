import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dropdown from "../../components/DropDown";
 
const AddQuestion = ({ onClose }: { onClose: () => void }) => {
  const [activePoints, setActivePoints] = useState<number | null>(400);
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [age, setAge] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleSubmit = () => {
    if (!category || !question || !answer || !age) {
      toast.warn("يرجى استكمال جميع الحقول!");
      return;
    }
    toast.success("تم الحفظ بنجاح!");
    onClose();
  };

  const resetHandle = () => {
    setCategory("");
    setQuestion("");
    setAnswer("");
    setAge("");
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
                    activePoints === point ? "bg-[#0765AA] text-white" : ""
                  }`}
                >
                  {point}
                </button>
              ))}
            </div>

             {/* Dropdown */}
             <label className="text-[#0765AA] font-bold" >أسم الفئة</label>
        <Dropdown
  options={[
    { value: "", label: "كل الحالات" },
    { value: "متاح", label: "متاح" },
    { value: "غير متاح", label: "غير متاح" },
  ]}
  selected={statusFilter}
  onChange={setStatusFilter}
/>

            {/* الفئة النشطة */}
            <label className="text-[#0765AA] font-bold" >الفئة النشطة</label>
            <div className="border  border-[#0765AA] flex items-center justify-between px-2 py-3 rounded text-sm text-right">
 <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="دول وعواصم"
              className="w-full  outline-none   text-sm text-right"
            />              
              <span className="text-red-500 text-xl cursor-pointer">
                <img src="/public/images/group/close.png" alt="" className="w-5 h-5" />
              </span>
            </div>

            {/* السؤال النشط */}
            <label className="text-[#0765AA] font-bold" >السؤال النشط</label>
            <div className="border  border-[#0765AA] flex items-center justify-between px-2 py-3 rounded text-sm text-right">
                <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="دول وعواصم"
              className="w-full  outline-none   text-sm text-right"
            />
              <span className="text-red-500 text-xl cursor-pointer">
                                <img src="/public/images/group/close.png" alt="" className="w-5 h-5" />

              </span>
            </div>

            {/* التلميح */}
            <label className="text-[#0765AA] font-bold" >التلميح</label>
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="التلميح"
              className="w-full rounded outline-none  border  border-[#0765AA] p-3 text-sm text-right"
            />

            {/* الأزرار */}
            <div className="flex justify-between gap-2 pt-2">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#0765AA] text-white rounded p-2"
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
                className="flex-1 border border-[#0765AA] text-[#0765AA] rounded p-2"
              >
                إغلاق
              </button>
            </div>
          </div>
          {/* السؤال والجواب */}
          <div className="flex flex-1 justify-between gap-4">
            

            {/* السؤال */}
            <div className="flex flex-col w-1/2 border  border-[#0765AA] p-2 rounded">
              <h3 className="text-center border p-4  border-[#0765AA] font-bold text-[#0765AA]  mb-2">السؤال</h3>
              <div className="border p-4  border-[#0765AA]  mb-2 text-right">{question || "مصر"}</div>
              <div className="border p-4  border-[#0765AA] flex justify-center items-center h-72">
                <img src="/public/images/group/img.png" alt="question" className="h-10" />
              </div>
            </div>
            {/* الجواب */}
            <div className=" flex flex-col w-1/2 border   border-[#0765AA]  p-2 rounded">
              <h3 className="text-center font-bold text-[#0765AA] border p-4  border-[#0765AA]  mb-2">الجواب</h3>
              <div className="border p-4  border-[#0765AA]  mb-2 text-right">{answer || "القاهرة"}</div>
              <div className="border p-4  border-[#0765AA] flex justify-center items-center h-72">
                <img src="/public/images/group/img.png" alt="question" className="h-10" />
              </div>
            </div>
          </div>

         
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddQuestion;
