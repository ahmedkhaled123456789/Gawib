import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonGroup from "../../components/ButtonGroup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/store";
import { addProduct, updateProduct } from "../../Redux/slice/productSlice";
import { useLocation, useNavigate } from "react-router-dom";
import ReactImageUpload from "react-images-upload";

interface InputFieldProps {
  label: string;
  placeholder: string;
  set: React.Dispatch<React.SetStateAction<string>>;
  val: string;
}

const InputField = ({ label, placeholder, set, val }: InputFieldProps) => {
  return (
    <div className="flex flex-col mb-4 w-full md:w-1/2 lg:w-1/3">
      <label className="mb-1 text-lg">{label}</label>
      <input
        value={val}
        onChange={(e) => set(e.target.value)}
        type="text"
        placeholder={placeholder}
        className="w-full rounded-lg bg-gray-200 p-3 text-sm shadow-md outline-none text-right"
      />
    </div>
  );
};

const AddProduct = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

   const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [productCode, setProductCode] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [productUrl, setProductUrl] = useState("");
  const [productType, setProductType] = useState("");
  const [status, setStatus] = useState("");
  const [productId, setProductId] = useState<string | null>(null);

   const isEditMode = location.pathname.includes("editproduct");

   useEffect(() => {
    if (isEditMode && location.state) {
      const { id, productName, description, productCode, title, productUrl, productType, status } = location.state;
      setProductId(id);
      setProductName(productName);
      setDescription(description);
      setProductCode(productCode);
      setTitle(title);
      setProductUrl(productUrl);
      setProductType(productType);
      setStatus(status);
    }
  }, [isEditMode, location]);

   const submitData = () => {
    if (!productName || !description || !productCode || !title || !productUrl || !productType || !status) {
      toast.warn("يرجى استكمال جميع الحقول!");
      return;
    }

    const productData = new FormData();
    productData.append("productName", productName);
    productData.append("description", description);
    productData.append("productCode", productCode);
    productData.append("title", title);
    if (image) productData.append("image", image);
    productData.append("productUrl", productUrl);
    productData.append("productType", productType);
    productData.append("status", status);

     if (isEditMode && productId) {
      dispatch(updateProduct({ id: productId, data: productData }))
        .then(() => {
          toast.success("تم التعديل بنجاح!");
          navigate("/products"); 
        })
        .catch(() => {
          toast.error("فشل في التعديل.");
        });
    } else {
      dispatch(addProduct(productData))
        .then(() => {
          toast.success("تمت إضافة المنتج بنجاح!");
          resetHandle();
        })
        .catch(() => {
          toast.error("فشل في إضافة المنتج.");
        });
    }
  };

   const resetHandle = () => {
    setProductName("");
    setDescription("");
    setProductCode("");
    setTitle("");
    setImage(null);
    setProductUrl("");
    setProductType("");
    setStatus("");
  };
  const handleImageChange = (imageList: File[]) => {
    setImage(imageList[0] || null);
  };
  
  return (
    <div className="w-full p-5 mb-4 text-right">
      

<nav aria-label="Breadcrumb" className="flex mb-5">
  <ol className="flex overflow-hidden rounded-lg border border-gray-200 text-gray-600">
    <li className="flex items-center">
      <a
        href="/"
        className="flex h-10 items-center gap-1.5 bg-gray-100 px-4 transition hover:text-gray-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>

        <span className="ms-1.5 text-xs font-medium"> الرئيسيه </span>
      </a>
    </li>

    <li className="relative flex items-center ">
      <span
        className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-100 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)] rtl:rotate-180"
      >
      </span>

      <a
        href="#"
      
        className="flex h-10 items-center bg-white pe-4 ps-8 text-xs font-medium transition text-gray-900"
      >
        المنتجات
      </a>
    </li>
  </ol>
</nav>
      <div className="bg-white rounded-md p-10 mb-5">
        <h1 className="font-semibold text-2xl">{isEditMode ? "تعديل منتج" : "إضافة منتج"}</h1>
        <form className="flex flex-wrap gap-5 pt-5">
          <InputField val={productName} set={setProductName} label="اسم المنتج" placeholder="أدخل اسم المنتج" />
          <InputField val={description} set={setDescription} label="الوصف" placeholder="أدخل وصف المنتج" />
          <InputField val={productCode} set={setProductCode} label="رمز المنتج" placeholder="أدخل رمز المنتج" />
          <InputField val={title} set={setTitle} label="العنوان" placeholder="أدخل العنوان" />

          

          <InputField val={productUrl} set={setProductUrl} label="رابط المنتج" placeholder="أدخل رابط المنتج" />

          <div className="flex flex-col mb-4 w-full md:w-1/2 lg:w-1/3">
            <label className="mb-1 text-lg">نوع المنتج</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full cursor-pointer rounded-lg bg-gray-200 p-3 text-sm shadow-md outline-none"
            >
              <option value="" disabled hidden>اختر نوع المنتج</option>
              <option>مادي</option>
              <option>رقمي</option>
            </select>
          </div>
          <div className="flex flex-col mb-4 w-full md:w-1/2 lg:w-1/3">
            <label className="mb-1 text-lg">صورة المنتج</label>
            <ReactImageUpload
          singleImage={true}
          onChange={handleImageChange}
          buttonText="+"
          withPreview={true}
          imgExtension={[".jpg", ".jpeg", ".png"]}
          maxFileSize={5242880}  
          buttonStyles={{
            backgroundColor: "#2A3335",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        />
         {/* Display Image Preview */}
         {image && (
          <div className="mt-4">
            <img
              src={URL.createObjectURL(image)}
              alt="Image Preview"
              className="w-full h-48 object-contain rounded-md border border-gray-300"
            />
          </div>
        )}
          </div>
          <div className="flex flex-col mb-4 w-full md:w-1/2 lg:w-1/3">
            <label className="mb-1 text-lg">الحالة</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full cursor-pointer rounded-lg bg-gray-200 p-3 text-sm shadow-md outline-none"
            >
              <option value="" disabled hidden>اختر الحالة</option>
              <option>نشط</option>
              <option>غير نشط</option>
            </select>
          </div>
        
        </form>

        <ButtonGroup handleSubmit={submitData} resetHandle={resetHandle} />
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddProduct;
