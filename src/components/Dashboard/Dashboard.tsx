const Dashboard = ({ counts }) => {
  const data = counts?.data || counts; // دعم الحالتين

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 🎮 العمود الأول: الألعاب والفئات */}
      <div className="w-full flex flex-col h-full">
        {/* الصف العلوي */}
        <div className="grid grid-cols-2 mb-2 rounded py-4 bg-[#085E9C] text-white text-center flex-1">
          <div className="py-3 border-l flex flex-col justify-center">
            <div className="text-sm mb-2 font-medium">الألعاب</div>
            <div className="text-lg font-bold">{data?.games ?? 0}</div>
          </div>
          <div className="py-3 flex flex-col justify-center">
            <div className="text-sm mb-2 font-medium">الفئات</div>
            <div className="text-lg font-bold">{data?.categories ?? 0}</div>
          </div>
        </div>

        {/* الصف السفلي */}
        <div className="grid grid-cols-2 py-4 rounded text-sm text-center border border-[#085E9C] flex-1">
          <div className="py-3 text-[#085E9C] border-l border-[#085E9C] flex flex-col justify-center">
            <div className="mb-2 font-semibold">باكدجات الألعاب</div>
            <div className="font-bold">{data?.gamePackages ?? 0}</div>
          </div>
          <div className="py-3 text-[#085E9C] flex flex-col justify-center">
            <div className="mb-2 font-semibold">أكواد الخصم</div>
            <div className="font-bold">{data?.discountCodes ?? 0}</div>
          </div>
        </div>
      </div>

      {/* 👥 العمود الثاني: المستخدمين */}
      <div className="w-full flex flex-col h-full">
        <div className="grid grid-cols-3 mb-2 rounded py-4 bg-[#085E9C] text-white text-center flex-1">
          <div className="py-3 border-l flex flex-col justify-center">
            <div className="text-sm mb-2 font-medium">المستخدمين</div>
            <div className="text-lg font-bold">{data?.users ?? 0}</div>
          </div>
          <div className="py-3 border-l flex flex-col justify-center">
            <div className="text-sm mb-2 font-medium">نشط الآن</div>
            <div className="text-lg font-bold">{data?.playedUsers ?? 0}</div>
          </div>
          <div className="py-3 flex flex-col justify-center">
            <div className="text-sm mb-2 font-medium">الألعاب الملعوبة</div>
            <div className="text-lg font-bold">{data?.playedGames ?? 0}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 py-4 rounded text-sm text-center border border-[#085E9C] flex-1">
          <div className="py-3 text-[#085E9C] border-l border-[#085E9C] flex flex-col justify-center">
            <div className="mb-2 font-semibold">بلاغات</div>
            <div className="font-bold">{data?.reports ?? 0}</div>
          </div>
          <div className="py-3 text-[#085E9C] flex flex-col justify-center">
            <div className="mb-2 font-semibold">تواصل معنا</div>
            <div className="font-bold">{data?.contactUs ?? 0}</div>
          </div>
        </div>
      </div>

      {/* 🧠 العمود الثالث: الأسئلة */}
      <div className="w-full flex flex-col h-full">
        <div className="rounded mb-2 py-4 bg-[#085E9C] text-white text-center flex-1 flex flex-col justify-center">
          <div className="text-lg font-bold mb-2">الأسئلة حسب النقاط</div>
          <div className="grid grid-cols-3">
            <div className="py-2 border-l flex flex-col justify-center">
              <div className="text-sm mb-1 font-medium">600</div>
              <div className="text-lg font-bold">{data?.questions_600 ?? 0}</div>
            </div>
            <div className="py-2 border-l flex flex-col justify-center">
              <div className="text-sm mb-1 font-medium">400</div>
              <div className="text-lg font-bold">{data?.questions_400 ?? 0}</div>
            </div>
            <div className="py-2 flex flex-col justify-center">
              <div className="text-sm mb-1 font-medium">200</div>
              <div className="text-lg font-bold">{data?.questions_200 ?? 0}</div>
            </div>
          </div>
        </div>

        <div className="rounded py-4 text-sm text-center border border-[#085E9C] text-[#085E9C] flex-1 flex flex-col justify-center">
          <div className="font-semibold mb-2">إجمالي الأسئلة</div>
          <div className="font-bold text-lg">
            {(data?.questions_600 ?? 0) +
              (data?.questions_400 ?? 0) +
              (data?.questions_200 ?? 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
