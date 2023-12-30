import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Blog from "./Frontend/Blog";
import Login from "./Frontend/Login";
import Register from "./Frontend/Register";
import Profile from "./Frontend/Profile";
import Create from "./Frontend/Create";
import Update from "./Frontend/Update";
import View from "./Frontend/ViewBlog";
import AdminBlogs from "./Frontend/AdminBlogs";
import AdminUsers from "./Frontend/AdminUsers";
import Notifications from "./Frontend/Notifications";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/blog" element={<Blog />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create" element={<Create />} />
        <Route path="/view/:blogId" element={<View />} />
        <Route path="/update/:blogId" element={<Update />} />
        <Route path="/adminblogs" element={<AdminBlogs />} />
        <Route path="/adminusers" element={<AdminUsers />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
