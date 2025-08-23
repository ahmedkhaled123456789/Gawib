import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonGroup from "../../components/ButtonGroup";
 


// AddAdmins.tsx
const ContactForm =  ({ selectedId, onClose }: { selectedId?: string; onClose: () => void }) => {
 const [message, setMessage] = useState("");


 const submitData = () => {
     if (!message) {
       toast.warn("يرجى استكمال جميع الحقول!");
       return;
     }
 
     const newDiscount = {
       answer: message,
     };
 
     // 👇 هنا الشرط
     const action = selectedId
       ? updateDiscountCode({ id: selectedId, data: newDiscount }) // Update
       : createDiscountCode(newDiscount); // Create
 
     dispatch(action)
       .unwrap()
       .then(() => {
         toast.success(selectedId ? "تم تحديث الكود بنجاح!" : "تمت إضافة الكود بنجاح!");
         onClose();
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
         <textarea name="" id=""  cols={25} rows={10} className="w-full rounded resize-none border border-[#085E9C]  p-3 text-sm shadow-md outline-none text-right" >
          سنرى ماذا يمكننا ان نفعل وسنضع ذلك في عين الاعتبار 
         </textarea>
  
        </form>
                  <ButtonGroup handleSubmit={submitData} resetHandle={resetHandle} onClose={onClose} />

      </div>
      <ToastContainer />
    </div>
  );
};

export default ContactForm;


 