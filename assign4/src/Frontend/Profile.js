import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
function Profile() {
  const [actual_email, setactual_email] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setUpdateMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:3001/BlogUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(token);
          console.log("Data received from server:", result);

          setactual_email(result.email);
          console.log(actual_email);
          if (result.username) {
            setUsername(result.username);
          }
          if (result.email) {
            setEmail(result.email);
          }
          if (result.password) {
            setPassword(result.password);
          }
        })
        .catch((err) => console.error("Error fetching user data:", err));
    } else {
      console.error("Token not found in local storage");
    }
  }, []);

  const handleUpdate = () => {
    console.log(actual_email);
    fetch("http://localhost:3001/BlogUsers/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailoriginal: actual_email,
        email: email,
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Data received from server:", result);
        localStorage.setItem("token", result.token);
        if (result.username) {
          setUsername(result.username);
        }
        if (result.email) {
          setactual_email(result.email);
          setEmail(result.email);
        }
        if (result.password) {
          setPassword(result.password);
        }
        setUpdateMessage("Profile Updated Successfully");
      })
      .catch((err) => console.error("Error fetching user data:", err));
  };

  return (
    <div className="profile-container">
      <Navbar />
      <h1
        style={{
          color: "White",
          fontSize: "50px",

          fontWeight: "bold",
        }}
      >
        Profile
      </h1>
      <div className="profile-form">
        <div className="cardProfile shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form
            className="card-body"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label htmlFor="username" style={{ color: "black" }}>
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label htmlFor="email" style={{ color: "black" }}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password" style={{ color: "black" }}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="btn"
              onClick={handleUpdate}
              style={{ color: "black" }}
            >
              Update
            </button>
            <div style={{ color: "Black", fontFamily: "sans" }}>{msg}</div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
