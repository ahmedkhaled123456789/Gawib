import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonGroup from "../../components/ButtonGroup";
 import { useDispatch } from "react-redux";
 import { AppDispatch } from "../../store";
import { updateContact } from "../../store/contactSlice";


// AddAdmins.tsx
const ContactForm =  ({ selectedId, onClose }: { selectedId?: string; onClose: () => void }) => {
 const [message, setMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();


 const submitData = () => {
     if (!message) {
       toast.warn("يرجى استكمال جميع الحقول!");
       return;
     }
 
     const newDiscount = {
       answer: message,
     };
 
   dispatch(updateContact({ id: selectedId, data: newDiscount }))
  .unwrap()
  .then(() => {
    toast.success(selectedId ? "تم التحديث بنجاح!" : "تمت الإضافة بنجاح!");
    onClose(); // closes modal
  })
  .catch((err) => {
    toast.error(err || "حدث خطأ أثناء الحفظ");
  });

   };
   const resetHandle = () => {
    setMessage("");


  };
  return (
    <div className="w-[60%] p-5 mb-4">
      <div className="bg-white rounded-md p-10 mb-5">
        <form className="flex flex-wrap  gap-5 pt-5">
          <label className="mb-1 text-lg font-bold text-right text-[#085E9C] " >الرد على الرسالة</label>
         <textarea value={message} name="" id=""  cols={25} rows={10} className="w-full rounded resize-none border border-[#085E9C]  p-3 text-sm shadow-md outline-none text-right"onChange={(e) => setMessage(e.target.value)}  >
         
         </textarea>
  
        </form>
                  <ButtonGroup handleSubmit={submitData} resetHandle={resetHandle} onClose={onClose} />

      </div>
      <ToastContainer />
    </div>
  );
};

export default ContactForm;


 