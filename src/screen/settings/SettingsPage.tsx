import React, { useState } from 'react';

const ArabicFormLayout: React.FC = () => {
  const [emailData, setEmailData] = useState({
    purchaseEmail: '',
    generalEmail: '',
    valueAddedTax: '$15'
  });

  const [textareaData, setTextareaData] = useState({
    aboutJawab: 'لغرض جودة الخدمة وسرعة الانجاز فأننا من الممكن مشاركة معلوماتك الشخصية وبيانات حجزك مع جميع فروعنا وخدمة العملاء ومع شركائنا (المضيفين) للتنسيق والتواصل معك إن دعت الحاجة لذلك. من الممكن أيضاً مشاركة بيانات التواصل الخاصة بك من بريد إلكتروني وجوال مع جهات أخرى جديرة بالثقة مثل الفنادق، ومع ذلك فإننا نضمن لك في مكان عدم مشاركة معلوماتك الشخصية لأي جهات ترويجية لغرض التسويق إلا بعد اخذ الموافقة المسبقة منك. أيضا، يحق لك طلب مشاركة معلوماتك مع طرف ثالث إن',
    termsOfUse: 'لغرض جودة الخدمة وسرعة الانجاز فأننا من الممكن مشاركة معلوماتك الشخصية وبيانات حجزك مع جميع فروعنا وخدمة العملاء ومع شركائنا (المضيفين) للتنسيق والتواصل معك إن دعت الحاجة لذلك. من الممكن أيضاً مشاركة بيانات التواصل الخاصة بك من بريد إلكتروني وجوال مع جهات أخرى جديرة بالثقة مثل الفنادق، ومع ذلك فإننا نضمن لك في مكان عدم مشاركة معلوماتك الشخصية لأي جهات ترويجية لغرض التسويق إلا بعد اخذ الموافقة المسبقة منك. أيضا، يحق لك طلب مشاركة معلوماتك مع طرف ثالث إن '
  });

  const handleInputChange = (field: string, value: string) => {
    setEmailData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTextareaChange = (field: string, value: string) => {
    setTextareaData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEmails = () => {
    alert('تم حفظ إعدادات البريد الإلكتروني');
  };

  const handleSaveAbout = () => {
    alert('تم حفظ معلومات عن جواب');
  };

  const handleSaveTerms = () => {
    alert('تم حفظ شروط الاستخدام');
  };

  const handleSaveTax = () => {
    alert('تم حفظ ضريبة القيمة المضافة');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className=" px-6 mb-4 border-b border-[#085E9C] py-3 text-right text-[#085E9C]  text-lg font-bold">
الإعدادات      </div>
      <div className="max-w-4xl mx-auto">
       

        {/* Messages and Electronic Mail Section */}
        <div className="bg-white  shadow-sm border border-[#085E9C] mb-6">
          <div className=" text-[#085E9C]   border-b border-[#085E9C] flex items-center justify-between">
                        <h2 className="text-lg font-medium ">     </h2>

            <h2 className="text-lg font-medium ">الرسائل والبريد الإلكتروني</h2>
            <button 
              onClick={handleSaveEmails}
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
                  value={emailData.purchaseEmail}
                  onChange={(e) => handleInputChange('purchaseEmail', e.target.value)}
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
                  value={emailData.generalEmail}
                  onChange={(e) => handleInputChange('generalEmail', e.target.value)}
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
              onClick={handleSaveAbout}
              className="bg-[#085E9C] text-white px-6 py-4   text-sm font-bold "
            >
              حفظ
            </button>
          </div>
          <div className="p-6">
            <textarea
              className="w-full h-32 px-4 py-3 border border-[#085E9C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm leading-relaxed resize-none"
              placeholder="اكتب وصف حول المنصة..."
              value={textareaData.aboutJawab}
              onChange={(e) => handleTextareaChange('aboutJawab', e.target.value)}
            />
          </div>
        </div>

        {/* Terms of Use Section */}
        <div className="bg-white rounded shadow-sm border border-[#085E9C] mb-6">
           
          <div className=" text-[#085E9C]   border-b border-[#085E9C] flex items-center justify-between">
                        <h2 className="text-lg font-medium ">     </h2>

            <h2 className="text-lg font-medium ">شروط الاستخدام</h2>
            <button 
              onClick={handleSaveTerms}
              className="bg-[#085E9C] text-white px-6 py-4   text-sm font-bold "
            >
              حفظ
            </button>
          </div>
          <div className="p-6">
            <textarea
              className="w-full h-32 px-4 py-3 border border-[#085E9C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm leading-relaxed resize-none"
              placeholder="اكتب شروط الاستخدام..."
              value={textareaData.termsOfUse}
              onChange={(e) => handleTextareaChange('termsOfUse', e.target.value)}
            />
          </div>
        </div>

        {/* Value Added Tax Section */}
        <div className="bg-white rounded shadow-sm border border-[#085E9C] mb-6">
           
           <div className=" text-[#085E9C]   border-b border-[#085E9C] flex items-center justify-between">
                        <h2 className="text-lg font-medium ">     </h2>

            <h2 className="text-lg font-medium ">ضريبة القيمة المضافة</h2>
            <button 
              onClick={handleSaveTax}
              className="bg-[#085E9C] text-white px-6 py-4   text-sm font-bold "
            >
              حفظ
            </button>
          </div> 
          <div className="p-6">
            <div className="flex items-center gap-4">
              <button className="bg-yellow-500 border w-[28%] border-yellow-500 hover:bg-yellow-600 text-[#085E9C] px-6 py-3 rounded text-sm font-medium transition-colors">
                ضريبة القيمة المضافة
              </button>
              <input
                type="text"
                placeholder="% 15"
                value={emailData.valueAddedTax}
                onChange={(e) => handleInputChange('valueAddedTax', e.target.value)}
                  className="flex-1 px-4 py-3 border border-[#085E9C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArabicFormLayout;