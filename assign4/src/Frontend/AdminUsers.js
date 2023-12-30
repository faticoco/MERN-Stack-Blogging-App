import Navbar from "./Navbar";

import "./App.css";

import React, { useState, useEffect } from "react";

function AdminUsers() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    console.log(token);
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    };
    fetch(`http://localhost:3001/BlogUsers/getall`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Data received from server:", result);
        setData(result);
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  const handleDisablestatus = (email) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    console.log(password, username, email);

    fetch(`http://localhost:3001/BlogUsers/disable/${email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Data received from server:", result.user);

        alert(
          "User status updated successfully to " +
            (result.user.status ? "Active" : "Disabled")
        );
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  };
  return (
    <div className="App ">
      <Navbar />
      <h1 style={{ color: "white", fontWeight: "bold", fontSize: "30px" }}>
        Users List
      </h1>
      <div className="flex flex-wrap">
        {data.map((d) => (
          <div className="card glass " id={d._id} key={d._id}>
            <br /> <br />
            <div>
              <br />
              <h2
                className="justify-end"
                style={{
                  color: "White",
                }}
              >
                <b>Username:</b> {d.username}
              </h2>
              <h3 style={{ fontSize: "13px", color: "Black" }}>
                <b>Email</b> {d.email}
              </h3>
              <h3
                style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}
              >
                {d.status ? "Status: Active" : "Status: Blocked"}
              </h3>
              <br></br>
              <br />
              <br></br> <br />
              <div className="button-container">
                <button onClick={() => handleDisablestatus(d.email)}>
                  Disable/Enable
                </button>
              </div>
            </div>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminUsers;
