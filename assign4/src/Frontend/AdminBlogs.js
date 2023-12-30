import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import "./App.css";

import React, { useState, useEffect } from "react";

function AdminBlogs() {
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3001/Blogs/getall`, {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Data received from server:", result);
        setData(result);
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, [data]);
  const handleView = (blogId) => {
    const updateUrl = `/view/${blogId}`;

    navigate(updateUrl);
  };
  const handlestatus = (id) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/Blog/disable/${id}`, {
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
        console.log("Data received from server:", result);
        alert(
          "Blog status updated successfully to " +
            (result.status ? "Active" : "Disabled")
        );
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  };
  return (
    <div className="App ">
      <Navbar />
      <h1 style={{ color: "white", fontWeight: "bold", fontSize: "30px" }}>
        Blogs List
      </h1>
      <div className="flex flex-wrap">
        {data.map((d) => (
          <div className="card glass " id={d._id} key={d._id}>
            <br /> <br />
            <figure>
              <img src={d.link} alt="car!" />
            </figure>
            <div>
              <br />
              <h2
                className="justify-end"
                style={{
                  color: "White",
                }}
              >
                {d.heading}
              </h2>
              <h3 style={{ fontSize: "13px", color: "Black" }}>
                Author: {d.creatorusername}
              </h3>
              <h3 style={{ fontSize: "13px", color: "Black" }}>
                Creation date:
                {new Date(d.creationDate).toLocaleDateString("en-US")}
              </h3>
              <h3 style={{ fontSize: "13px", color: "Black" }}>
                Average Rating:
                {d.averageRating}
              </h3>
              <h3 style={{ fontSize: "13px", color: "Black" }}>
                {d.status ? "Status:Active" : "Status:Disabled"}
              </h3>
              <br></br>
              <p
                style={{
                  color: "Black",
                }}
              >
                Text {d.text}
              </p>
              <br />
              <br></br> <br />
              <div className="button-container">
                <button
                  className="btn"
                  style={{
                    height: "50px",
                    width: "200px",
                    color: "Blue",
                    borderRadius: "50px",
                  }}
                  onClick={() => handlestatus(d._id)}
                >
                  Disable/Enable
                </button>
                <button
                  className="btn"
                  style={{
                    height: "50px",
                    width: "100px",
                    color: "black",
                    borderRadius: "50px",
                  }}
                  onClick={() => handleView(d._id)}
                >
                  View
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

export default AdminBlogs;
