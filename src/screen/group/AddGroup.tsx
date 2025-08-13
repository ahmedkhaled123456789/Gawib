import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonGroup from "../../components/ButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { addCategory, getCategories } from "../../store/categoriesSlice";
import { getAdmins } from "../../store/adminSlice";
import { createGame } from "../../store/gameSlice";

interface InputFieldProps {
  label: string;
  set: React.Dispatch<React.SetStateAction<string>>;
  val: string;
  type?: string;
}

const InputField = ({ label, set, val, type = "text" }: InputFieldProps) => (
  <div className="flex flex-col mb-2 w-[48%]">
    <label className="mb-2 text-lg text-[#085E9C] font-bold">{label}</label>
    <input
      value={val}
      onChange={(e) => set(e.target.value)}
      type={type}
      className="w-full text-black rounded-sm border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
    />
  </div>
);

const AddGroup = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);
 const { admins,loading } = useSelector((state: RootState) => state.admin);

  
  

  useEffect(() => {
    dispatch(getCategories());
      dispatch(getAdmins());
  }, [dispatch]);
   const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [category_id, setCategory_id] = useState("");
  const [admin_id, setAdmin_id] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const submitData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name  || !admin_id || !description || !image) {
      toast.warn("يرجى استكمال جميع الحقول!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("category_id",category_id);
    formData.append("is_active", "1");
    formData.append("admin_id", "1");

    try {
       const resultAction = await dispatch(createGame(formData));

      if (createGame.fulfilled.match(resultAction)) {
        toast.success("تمت إضافة المجموعة بنجاح!");
         onClose();
        resetHandle();
      } else {
        toast.error("حدث خطأ أثناء الإضافة");
      }
    } catch {
      toast.error("فشل الاتصال بالسيرفر");
    }
  };

  const resetHandle = () => {
    setName("");
    setDescription("");
    setImage(null);
    setCategory_id("");
    setAdmin_id("");
  };

  return (
    <div className="w-[70%] px-5 font-medium">
      <div className="bg-white rounded-md p-6">
        {/* Category Drop-down */}
        <div className="flex flex-col w-full">
          <label className="mb-2 text-lg text-[#085E9C] font-bold">نوع الفئة</label>
          <select
            value={category_id}
            onChange={(e) => setCategory_id(e.target.value)}
            className="w-full bg-[#D5D5D5] rounded-sm border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
          >
            <option value="">اختر الفئة</option>
             {Array.isArray(categories?.data) && categories.data.length > 0 ? (
  categories.data.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name || "ahmed"}
    </option>
  ))
) : (
  <option disabled>لا توجد مجموعات حاليًا</option>
)}


          </select>
        </div>

        <form
          className="flex flex-wrap justify-between gap-4 pt-5 text-[#085E9C]"
          onSubmit={submitData}
        >
          <InputField val={name} set={setName} label="أسم الفئة" />

          {/* Admin Drop-down */}
          <div className="flex flex-col mb-2 w-[48%]">
            <label className="mb-2 text-lg text-[#085E9C] font-bold">أسم المشرف</label>
            <select
              value={admin_id}
              onChange={(e) => setAdmin_id(e.target.value)}
              className="w-full text-black rounded-sm border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
            >
              <option value="">اختر المشرف</option>
              
               {Array.isArray(admins?.data) && admins.data.length > 0 ? (
  admins.data.map((admin) => (
    <option key={admin.id} value={admin.id}>
      {admin.name}
    </option>
  ))
) : (
  !loading && <option disabled>لا يوجد مشرفين حاليًا</option>
)}

            </select>
          </div>

          {/* Description */}
          <div className="w-full md:w-[48%]">
            <label className="mb-2 text-lg font-bold block">تعليمات الفئة</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none h-[190px] text-black border border-[#085E9C] rounded-sm p-3 text-sm outline-none text-right shadow-md"
            />
          </div>

          {/* Image Upload */}
          <div className="w-full md:w-[48%] flex flex-col">
            <label className="mb-2 text-lg font-bold">صورة الفئة الرئيسية</label>
            <div
              className="w-full h-[190px] border border-[#085E9C] flex items-center justify-center cursor-pointer rounded-sm hover:shadow-lg transition"
              onClick={handleImageClick}
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-[60px] h-[60px]"
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
            />
          </div>
        </form>

        {/* Buttons */}
        <ButtonGroup handleSubmit={submitData} resetHandle={resetHandle} onClose={onClose} />
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddGroup;







// import { useState, useRef } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import ButtonGroup from "../../components/ButtonGroup";

// interface InputFieldProps {
//   label: string;
//    set: React.Dispatch<React.SetStateAction<string>>;
//   val: string;
//   type: string;
// }

// const InputField = ({ label, set, val, type }: InputFieldProps) => (
//   <div className="flex flex-col  mb-2 w-[48%]">
//     <label className="mb-2 text-lg text-[#085E9C] font-bold">{label}</label>
//     <input
//       value={val}
//       onChange={(e) => set(e.target.value)}
//       type={type}
//       className="w-full text-black rounded-sm border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
//     />
//   </div>
// );

// const AddGroup = ({ onClose }: { onClose: () => void }) => {
//   const [name, setName] = useState("دول وعواصم");
//   const [type, setType] = useState("جغرافيا والعالم");
//   const [admin, setAdmin] = useState("ماهر البوعلي");
//   const [role, setRole] = useState("هذه الفئة تختص بدولة ما وعاصمتها وعملتها ولغتها ");
//   const [image, setImage] = useState<File | null>(null);

//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleImageClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) setImage(file);
//   };

//   const submitData = () => {
//     if (!name || !type || !admin || !role || !image) {
//       toast.warn("يرجى استكمال جميع الحقول!");
//       return;
//     }
//     toast.success("تمت إضافة المجموعة بنجاح!");
//     onClose();
//   };

//   const resetHandle = () => {
//     setName("");
//     setType("");
//     setAdmin("");
//     setRole("");
//     setImage(null);
//   };

//   return (
//     <div className="w-[70%] px-5 font-medium   ">
//       <div className="bg-white rounded-md p-6 ">
//         {/* Product Type */}
//         <div className="flex flex-col  w-full  ">
//           <label className="mb-2 text-lg text-[#085E9C] font-bold">نوع الفئة </label>
          
//     <input
//       value={type}
//       onChange={(e) => setType(e.target.value)}
//       type={type}
//        className="w-full bg-[#D5D5D5]  rounded-sm border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
//     />
//          </div>

//         {/* Form Fields */}
//         <form className="flex flex-wrap justify-between gap-4 pt-5 text-[#085E9C]">
//           <InputField val={name} set={setName} type="text" label="أسم الفئة"  />
//           <InputField val={admin} set={setAdmin} type="text" label="أسم المشرف"  />

  
//           {/* Instructions + Image Upload Row */}
//           <div className="flex flex-wrap   justify-between  w-full gap-4 ">
//             {/* Instructions */}
//             <div className="w-full md:w-[48%] ">
//               <label className="mb-2 text-lg font-bold block">تعليمات الفئة</label>
//               <textarea
//                 className="w-full resize-none h-[190px] text-black border border-[#085E9C] rounded-sm p-3 text-sm outline-none text-right  shadow-md"
//               >
//                 هذه الفئة تختص بدولة ما وعاصمتها وعملتها ولغتها
//               </textarea>
//             </div>

//             {/* Image Upload */}
//             <div className="w-full md:w-[48%] flex flex-col ">
//               <label className="mb-2 text-lg font-bold">صورة الفئة الرئيسية</label>
//               <div
//                 className="w-full h-[190px]   border border-[#085E9C] flex items-center justify-center cursor-pointer rounded-sm hover:shadow-lg transition"
//                 onClick={handleImageClick}
//               >
//                 {image ? (
//                   <img
//                     src={URL.createObjectURL(image)}
//                     alt="Preview"
//                     className="w-[60px] h-[60px] "
//                   />
//                 ) : (
//                   <img src="/images/group/img.png" alt="Placeholder" className="w-[60px] h-[60px]" />
//                 )}
//               </div>
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={fileInputRef}
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </div>
//           </div>
//         </form>

//         {/* Buttons */}
//         <div className="">
//           <ButtonGroup handleSubmit={submitData} resetHandle={resetHandle} onClose={onClose} />
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default AddGroup;
