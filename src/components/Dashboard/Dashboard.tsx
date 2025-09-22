const Dashboard = ({ counts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Column 1 */}
      <div className="w-full">
        {/* Top Row: Blue background */}
        <div className="grid grid-cols-2 mb-2 rounded py-4 bg-[#085E9C] text-white text-center">
          <div className="py-3 border-l">
            <div className="text-sm mb-2 font-medium">الفئات</div>
            <div className="text-lg font-bold">{counts?.games}</div>
          </div>
          <div className="py-3">
            <div className="text-sm mb-2 font-medium">المجموعات</div>
            <div className="text-lg font-bold">{counts?.categories}</div>
          </div>
        </div>

        {/* Bottom Row: White with borders */}
        <div className="grid grid-cols-2 py-4 rounded text-sm text-center border border-[#085E9C]">
          <div className="py-3 text-[#085E9C] border-l border-[#085E9C]">
            <div className="mb-2 font-semibold">الأسئلة (600)</div>
            <div className="font-bold">{counts?.questions_600}</div>
          </div>
          <div className="py-3 text-[#085E9C]">
            <div className="mb-2 font-semibold">الأسئلة (400)</div>
            <div className="font-bold">{counts?.questions_400}</div>
          </div>
        </div>
      </div>

      {/* Column 2 */}
      <div className="w-full">
        {/* Top Row: Blue background */}
        <div className="grid grid-cols-3 mb-2 rounded py-4 bg-[#085E9C] text-white text-center">
          <div className="py-3 border-l">
            <div className="text-sm mb-2 font-medium">الاقتراحات</div>
            <div className="text-lg font-bold">{counts?.contactUs}</div>
          </div>
          <div className="py-3 border-l">
            <div className="text-sm mb-2 font-medium">التواصل</div>
            <div className="text-lg font-bold">{counts?.contactUs}</div>
          </div>
          <div className="py-3">
            <div className="text-sm mb-2 font-medium">البلاغات</div>
            <div className="text-lg font-bold">{counts?.reports}</div>
          </div>
        </div>

        {/* Bottom Row: White with borders */}
        <div className="grid grid-cols-3 rounded py-4 text-sm text-center border border-[#085E9C]">
          <div className="py-3 text-[#085E9C] border-l border-[#085E9C]">
            <div className="mb-2 font-semibold">الأسئلة (600)</div>
            <div className="font-bold">{counts?.questions_600}</div>
          </div>
          <div className="py-3 text-[#085E9C] border-l border-[#085E9C]">
            <div className="mb-2 font-semibold">الأسئلة (400)</div>
            <div className="font-bold">{counts?.questions_400}</div>
          </div>
          <div className="py-3 text-[#085E9C]">
            <div className="mb-2 font-semibold">الأسئلة (200)</div>
            <div className="font-bold">{counts?.questions_200}</div>
          </div>
        </div>
      </div>

      {/* Column 3 */}
      <div className="w-full">
        {/* Top Row: Blue background */}
        <div className="grid grid-cols-3 mb-2 rounded p-4 bg-[#085E9C] text-white text-center">
          <div className="py-3 border-l">
            <div className="text-sm mb-2 font-medium">نشط الآن</div>
            <div className="text-lg font-bold">{counts?.playedUsers}</div>
          </div>
          <div className="py-3 border-l">
            <div className="text-sm mb-2 font-medium">الجنسيات</div>
            <div className="text-lg font-bold">{counts?.categories}</div>
          </div>
          <div className="py-3">
            <div className="text-sm mb-2 font-medium">المستخدمين</div>
            <div className="text-lg font-bold">{counts?.users}</div>
          </div>
        </div>

        {/* Bottom Row: White with borders */}
        <div className="grid grid-cols-3 p-4 rounded text-sm text-center border border-[#085E9C]">
          <div className="py-3 text-[#085E9C] border-l border-[#085E9C]">
            <div className="mb-2 font-semibold">الأسئلة (600)</div>
            <div className="font-bold">{counts?.questions_600}</div>
          </div>
          <div className="py-3 text-[#085E9C] border-l border-[#085E9C]">
            <div className="mb-2 font-semibold">الأسئلة (400)</div>
            <div className="font-bold">{counts?.questions_400}</div>
          </div>
          <div className="py-3 text-[#085E9C]">
            <div className="mb-2 font-semibold">الأسئلة (200)</div>
            <div className="font-bold">{counts?.questions_200}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
