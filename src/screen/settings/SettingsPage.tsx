import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { getSettings, updateSetting } from "../../store/settingSlice";
 
const ArabicFormLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { settings } = useSelector((state: RootState) => state.settings);
   const [formData, setFormData] = useState<Record<string, string>>({});
   useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

   useEffect(() => {
    const mapped: Record<string, string> = {};
    settings?.data.forEach((item) => {
      mapped[item.key] = item.value;
    });
    setFormData(mapped);
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (key: string) => {
    const setting = settings?.data.find((s) => s.key === key);
    if (setting) {
      dispatch(updateSetting({ id: setting.id.toString(), data: { ...setting, value: formData[key] } }));
    }
  };

  return (
    <div dir="rtl" className="p-4">
      <h1 className="text-lg font-bold mb-4 text-[#085E9C]">الإعدادات</h1>


     

    
 {/* Messages and Electronic Mail Section */}
        <div className="bg-white  shadow-sm border border-[#085E9C] mb-6">
          <div className=" text-[#085E9C]   border-b border-[#085E9C] flex items-center justify-between">
                        <h2 className="text-lg font-medium ">     </h2>

            <h2 className="text-lg font-medium ">الرسائل والبريد الإلكتروني</h2>
            <button 
 onClick={() =>{
   handleSave("buy_message");
handleSave("gift_message");
 }}        
       className="bg-[#085E9C] text-white px-6 py-4   text-sm font-bold "
            >
              حفظ
            </button>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {/* Purchase Email */}
              <div className="flex items-center gap-4">
                <button className="bg-yellow-500 w-[28%] border border-yellow-500 hover:bg-yellow-600 text-[#085E9C] px-6 py-3 rounded text-sm font-medium transition-colors">
                  ادفع الآن ( الشراء )
                </button>
                <input
                  type="email"
                  placeholder="شكرا لشراء 3 أعضاء بمبلغ 150 ريال، استخدم بريدك"
                 value={formData["buy_message"] || ""}
          onChange={(e) => handleChange("buy_message", e.target.value)}
                  className="flex-1 px-4 py-3 border border-[#085E9C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* General Email */}
              <div className="flex items-center gap-4">
                <button className="bg-yellow-500 w-[28%] border border-yellow-500 hover:bg-yellow-600 text-[#085E9C] px-6 py-3 rounded text-sm font-medium transition-colors">
                  ادفع الآن ( الصفحة )
                </button>
                <input
                  type="email"
                  placeholder="مبروك العضوية، حصلت على رصيد واحد، استخدم بريدك"
                 value={formData["gift_message"] || ""}
          onChange={(e) => handleChange("gift_message", e.target.value)}
                  className="flex-1 px-4 py-3  border border-[#085E9C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      
 {/* About Jawab Section */}
        <div className="bg-white rounded shadow-sm border border-[#085E9C] mb-6">
           
            <div className=" text-[#085E9C]   border-b border-[#085E9C] flex items-center justify-between">
                        <h2 className="text-lg font-medium ">     </h2>

            <h2 className="text-lg font-medium ">عن جواب</h2>
            <button 
 onClick={() => handleSave("about_us")}              className="bg-[#085E9C] text-white px-6 py-4   text-sm font-bold "
            >
              حفظ
            </button>
          </div>
          <div className="p-6">
            <textarea
              className="w-full h-32 px-4 py-3 border border-[#085E9C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm leading-relaxed resize-none"
              placeholder="اكتب وصف حول المنصة..."
               value={formData["about_us"] || ""}
          onChange={(e) => handleChange("about_us", e.target.value)}
            />
          </div>
        </div>

        {/* Terms of Use Section */}
        <div className="bg-white rounded shadow-sm border border-[#085E9C] mb-6">
           
          <div className=" text-[#085E9C]   border-b border-[#085E9C] flex items-center justify-between">
                        <h2 className="text-lg font-medium ">     </h2>

            <h2 className="text-lg font-medium ">شروط الاستخدام</h2>
            <button 
          onClick={() => handleSave("terms_and_conditions")}
              className="bg-[#085E9C] text-white px-6 py-4   text-sm font-bold "
            >
              حفظ
            </button>
          </div>
          <div className="p-6">
            <textarea
              className="w-full h-32 px-4 py-3 border border-[#085E9C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm leading-relaxed resize-none"
              placeholder="اكتب شروط الاستخدام..."
                value={formData["terms_and_conditions"] || ""}
          onChange={(e) => handleChange("terms_and_conditions", e.target.value)}
            />
          </div>
        </div>

{/* Value Added Tax Section */}
        <div className="bg-white rounded shadow-sm border border-[#085E9C] mb-6">
           
           <div className=" text-[#085E9C]   border-b border-[#085E9C] flex items-center justify-between">
                        <h2 className="text-lg font-medium ">     </h2>

            <h2 className="text-lg font-medium ">ضريبة القيمة المضافة</h2>
            <button 
              onClick={() => handleSave("app_stamp_tax")}
              className="bg-[#085E9C] text-white px-6 py-4   text-sm font-bold "
            >
              حفظ
            </button>
          </div> 
          <div className="p-6">
            <div className="flex items-center gap-4">
              <button className="bg-yellow-500 border w-[28%] border-yellow-500 hover:bg-yellow-600 text-[#085E9C] px-6 py-3 rounded text-sm font-medium transition-colors"
              
              >
                ضريبة القيمة المضافة
              </button>
              <input
                type="text"
                placeholder="% 15"
              value={formData["app_stamp_tax"] || ""}
          onChange={(e) => handleChange("app_stamp_tax", e.target.value)}
                  className="flex-1 px-4 py-3 border border-[#085E9C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
    
    </div>
  );
};

export default ArabicFormLayout;
