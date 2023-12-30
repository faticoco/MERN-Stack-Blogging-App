// App.js
import { Navbar } from "flowbite-react";
import "./App.css";
import Blog from "./Blog";
import Login from "./Login";
import Register from "./Register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppRouter from "../AppRouter";

function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
