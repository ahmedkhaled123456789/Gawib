import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect } from "react";

const DashboardLayout = () => {
  const direction = "rtl";

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  return (
    <main className="flex" dir={direction}>
      <Sidebar />
      <div className="p-4 w-full overflow-x-hidden">
        <Outlet /> {/* هنا بيظهر المحتوى الخاص بكل صفحة */}
      </div>
    </main>
  );
};

export default DashboardLayout;
