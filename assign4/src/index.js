import React from "react";
import ReactDOM from "react-dom";
import App from "./Frontend/App";
import reportWebVitals from "./reportWebVitals";
import AppRouter from "./AppRouter";

ReactDOM.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
