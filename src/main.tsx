import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
 import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer
        theme="light"
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover={false}
      />
         <App />
     </Provider>
  </React.StrictMode>
);
