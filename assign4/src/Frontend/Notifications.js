import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

function Notifications() {
  const [notifs, setnotifs] = useState([]);
  useEffect(() => {
    const email = localStorage.getItem("email");

    fetch(`http://localhost:3001/BlogUsers/notifications/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Data received from server:", result);
        setnotifs(result);
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, []);

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
        Notifications
      </h1>
      <div className="profile-form">
        <div className="cardProfile shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div style={{ color: "black" }}>
            {notifs.map((c, ind) => {
              return (
                <div style={{ border: "solid 1px white" }} key={c._id}>
                  <span id={c._id} key={c._id}>
                    {ind}:{c}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
