import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";

import "./App.css";

function Update() {
  const { blogId } = useParams();

  const [heading, setHeading] = useState("");
  const [text, setText] = useState("");
  const [link, setlink] = useState("");
  useEffect(() => {
    console.log(blogId);
    fetch(`http://localhost:3001/Blog/${blogId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setHeading(result.heading);
        setText(result.text);
        setlink(result.link);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const handleUpdate = () => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    fetch(`http://localhost:3001/Blog/${blogId}`, {
      method: "PUT",
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
        if (result.err) {
          alert("Cannot Update Blog you do not own!");
        } else {
          console.log("Data received from server:", result);
          setHeading(result.heading);
          setText(result.text);
          setlink(result.link);
          alert("Blog Successfully Updated");
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  };
  return (
    <div className="App ">
      <div className="profile-container">
        <Navbar />
        <h1 style={{ color: "white", fontWeight: "bold", fontSize: "30px" }}>
          Update Blog
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="card lg:card-side bg-base-100 shadow-xl">
            <form
              className="card-body"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label htmlFor="heading" style={{ color: "black" }}>
                Heading:
              </label>
              <input
                type="text"
                id="heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
              />

              <label htmlFor="text" style={{ color: "black" }}>
                Text:
              </label>
              <input
                type="text"
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <label htmlFor="link" style={{ color: "black" }}>
                Link:
              </label>
              <input
                type="text"
                id="link"
                value={link}
                onChange={(e) => setlink(e.target.value)}
              />

              <button
                className="btn"
                onClick={handleUpdate}
                style={{ color: "black" }}
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Update;
