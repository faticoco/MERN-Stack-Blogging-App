import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";
import { useMediaQuery } from "@react-hook/media-query";

function Navbar() {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(min-width: 0px) and (max-width: 500px)");

  const handleDrawerToggle = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="navbar" style={{ position: "relative" }}>
      <div>
        <a
          className="text-xl"
          style={{
            fontFamily: "monospace",
            fontSize: "30px",
            marginLeft: "5px",
            marginRight: "30px",
            color: "white",
          }}
        >
          Bloggima
        </a>
      </div>
      <div
        className="links"
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          fontWeight: "bold",
        }}
      >
        <Link
          to="/create"
          className="text-white mx-4"
          style={{ marginRight: "20px" }}
        >
          Create
        </Link>
        {username === "admin" && (
          <Link
            to="/adminusers"
            className="text-white mx-4"
            style={{ marginRight: "20px" }}
          >
            Users
          </Link>
        )}
        {username === "admin" && (
          <Link
            to="/adminblogs"
            className="text-white mx-4"
            style={{ marginRight: "20px" }}
          >
            Admin Blogs
          </Link>
        )}

        <Link
          to="/blog"
          className="text-white mx-4"
          style={{ marginRight: "20px" }}
        >
          Feed
        </Link>
      </div>
      <div
        className="form-control"
        style={{
          position: "absolute",
          top: 10,
          right: 100,
          alignItems: "center",
        }}
      ></div>
      <div
        className="dropdown dropdown-end"
        style={{
          position: "absolute",
          top: 10,
          right: 20,
          alignItems: "center",
        }}
      >
        <div className="avatar-container">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar"
            onClick={handleDrawerToggle}
          >
            <div className="w-10 rounded-full">
              <img
                style={{ borderRadius: "50%", height: "40px", width: "40px" }}
                alt="User Avatar"
                src="https://static.vecteezy.com/system/resources/previews/000/654/765/original/woman-face-cartoon-vector.jpg"
              />
            </div>
          </label>
        </div>
        <div
          className={`drawer drawer-content ${isDrawerOpen ? "active" : ""}`}
          style={{
            top: 50,
            right: 20,
            zIndex: 999,
            display: isDrawerOpen ? "block" : "none",
          }}
        >
          <ul className="menu p-4 w-96 min-h-full text-base-content">
            <li className="drawer-item">
              <a
                className="drawer-link hover:text-white"
                onClick={() => navigate("/profile")}
              >
                Profile
              </a>
            </li>
            {isMobile && (
              <li className="drawer-item">
                <a
                  className="drawer-link hover:text-white"
                  onClick={() => navigate("/create")}
                >
                  Create
                </a>
              </li>
            )}
            {isMobile && (
              <li className="drawer-item">
                <a
                  className="drawer-link hover:text-white"
                  onClick={() => navigate("/blog")}
                >
                  Feed
                </a>
              </li>
            )}

            {isMobile && username === "admin" && (
              <li className="drawer-item">
                <a
                  className="drawer-link hover:text-white"
                  onClick={() => navigate("/adminusers")}
                >
                  Users
                </a>
              </li>
            )}

            {isMobile && username === "admin" && (
              <li className="drawer-item">
                <a
                  className="drawer-link hover:text-white"
                  onClick={() => navigate("/adminblogs")}
                >
                  Manage Blogs
                </a>
              </li>
            )}
            <li className="drawer-item">
              <a
                className="drawer-link hover:text-white"
                onClick={() => navigate("/notifications")}
              >
                Notifications
              </a>
            </li>

            <li className="drawer-item">
              <a
                className="drawer-link hover:text-white"
                onClick={() => navigate("/")}
              >
                Login
              </a>
            </li>
            <li className="drawer-item">
              <a
                className="drawer-link hover:text-white"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </a>
            </li>

            <li className="drawer-item">
              <a
                className="drawer-link hover:text-white"
                onClick={() => logout()}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
