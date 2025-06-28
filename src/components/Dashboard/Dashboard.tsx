import DashboardCard from "./DashboardCard";

const Dashboard = () => {
  const cardData = [
    {
      top: [
        { label: "الفئات", value: "500" },
        { label: "المجموعات", value: "500" },
      ],
      bottom: [
        { label: "الألعاب", value: "500" },
        { label: "مستخدمي الألعاب", value: "500" },
      ],
    },
    {
      top: [
        { label: "الاقتراحات", value: "500" },
        { label: "التواصل", value: "500" },
      ],
      bottom: [
        { label: "الألعاب (600)", value: "300" },
        { label: "الألعاب (400)", value: "300" },
      ],
    },
    {
      top: [
        { label: "نشط الآن", value: "500" },
        { label: "الجنسيات", value: "500" },
      ],
      bottom: [
        { label: "الأسئلة (400)", value: "1800" },
        { label: "الأسئلة (200)", value: "1800" },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-3 mr-44 gap-4">
      {cardData.map((card, index) => (
        <DashboardCard key={index} data={card} />
      ))}
    </div>
  );
};

export default Dashboard;
