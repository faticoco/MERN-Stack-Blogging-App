import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./App.css";

function Create() {
  const [heading, setHeading] = useState("");
  const [msg, setUpdateMessage] = useState("");
  const [text, setText] = useState("");
  const [link, setlink] = useState("");

  const createBlog = (event) => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    fetch("http://localhost:3001/Blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        heading: heading,
        text: text,
        link: link,
        creatoremail: email,
        creatorusername: username,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Data received from server:", result);
        event.preventDefault();
        setUpdateMessage("Blog Successfully Created");
        alert("Blog Successfully Created");
      })
      .catch((err) => console.error("Error fetching data:", err));
  };
  const setlinkvalue = (e) => {
    setlink(e);
    if (e == "") {
      setUpdateMessage("Link is empty");
    } else {
      setUpdateMessage("");
    }
  };
  return (
    <div className="App ">
      <div className="profile-container">
        <Navbar />
        <h1 style={{ color: "white", fontWeight: "bold", fontSize: "30px" }}>
          Upload Blog
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="card lg:card-side bg-base-100 shadow-xl"
            style={{ border: "2px solid white" }}
          >
            <figure>
              {link && <img src={`url(link)`} alt="Blog Image" />}
            </figure>
            <div className="card-body">
              <div className="card-actions justify-end">
                <form className="card-body">
                  <div className="form-control">
                    <label className="label">
                      <span
                        className="label-text"
                        style={{ color: "Black", fontWeight: "bold" }}
                      >
                        Heading
                      </span>
                    </label>
                    <input
                      style={{ backgroundColor: "white" }}
                      type="text"
                      placeholder="Enter Heading"
                      className="input input-bordered"
                      value={heading}
                      onChange={(e) => setHeading(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span
                        className="label-text"
                        style={{ color: "Black", fontWeight: "bold" }}
                      >
                        Text
                      </span>
                    </label>
                    <input
                      style={{ backgroundColor: "white" }}
                      type="text"
                      placeholder="Enter Text"
                      className="input input-bordered"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span
                        className="label-text"
                        style={{ color: "Black", fontWeight: "bold" }}
                      >
                        Link
                      </span>
                    </label>
                    <input
                      style={{ backgroundColor: "white" }}
                      type="text"
                      placeholder="link"
                      className="input input-bordered"
                      value={link}
                      onChange={(e) => setlinkvalue(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-control mt-6">
                    <button className="btn btn-primary" onClick={createBlog}>
                      Upload
                    </button>
                  </div>
                </form>
                <div style={{ color: "Black", fontFamily: "sans" }}>{msg}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;
