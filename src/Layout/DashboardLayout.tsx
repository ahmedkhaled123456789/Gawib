 import Auth from "../Auth/Auth";
import Sidebar from "./Sidebar";
// import {  useAppSelector } from "../Redux/store";
import { useEffect } from "react";

const DashboardLayout = ({ children }: React.PropsWithChildren<unknown>) => {
   
  // const user = useAppSelector((state) => state.auth.loginUser);
const user =true;
   const direction = "rtl";

   useEffect(() => {
    document.documentElement.dir = direction;  
  }, [direction]);

  return (
    <main
      className={`flex  `}
      dir={direction}
    >
      {user ? (
        <>
          <Sidebar />
          <div className="p-4 w-full overflow-x-hidden">{children}</div>
        </>
      ) : (
        <>
          <Auth />
         </>
      )}
    </main>
  );
};

export default DashboardLayout;
