import { BrowserRouter, useRoutes } from "react-router-dom";
import { ROUTES } from "./Routes/ROUTES";

function AppRoutes() {
  const element = useRoutes(ROUTES);
  return element;
}

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
