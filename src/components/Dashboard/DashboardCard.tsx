const DashboardCard = ({ data }) => {
  return (
    <div className="w-full max-w-xs rounded border shadow overflow-hidden">
      {/* Top Row: Blue background */}
      <div className="grid grid-cols-2 p-4 bg-[#0765AA] text-white text-center divide-x divide-white">
        {data.top.map((item, idx) => (
          <div key={idx} className="p-3 border-l ">
            <div className="text-sm font-medium">{item.label}</div>
            <div className="text-lg font-bold">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Bottom Row: White with borders */}
      <div className="grid grid-cols-2 text-center divide-x divide-gray-300 divide-y border-t">
        {data.bottom.map((item, idx) => (
          <div key={idx} className="p-3 text-sm">
            <div className="text-gray-700 font-semibold">{item.label}</div>
            <div className="text-[#0765AA] font-bold">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCard;
