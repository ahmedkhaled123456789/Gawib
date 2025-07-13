import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonGroup from "../../components/ButtonGroup";
 


// AddAdmins.tsx
const ContactForm = ({ onClose }: { onClose: () => void }) => {
 const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [price, setPrice] = useState("");

  const submitData = () => {
    if (!name || !count || !price) {
      toast.warn("يرجى استكمال جميع الحقول!");
      return;
    }

    // Submit logic here
    toast.success("تمت إضافة المشرف بنجاح!");
    onClose(); // close modal on success
  };
   const resetHandle = () => {
    setName("");
    setCount("");
    setPrice("");

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


 