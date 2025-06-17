import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./Routes/ROUTES";
import DashboardLayout from "./Layout/DashboardLayout";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          {ROUTES.map((route, indx) => (
            <Route {...route} key={indx} />
          ))}
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
