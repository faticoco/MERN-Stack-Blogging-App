import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";

import "./App.css";

function View() {
  const { blogId } = useParams();

  const [heading, setHeading] = useState("");
  const [text, setText] = useState("");
  const [link, setlink] = useState("");
  const [username, setusername] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [rating, setRating] = useState(3);

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
        setusername(result.creatorusername);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  useEffect(() => {
    console.log(blogId);
    fetch(`http://localhost:3001/getComments/${blogId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setComments(result.comments);
        console.log(result.users);
        setUsers(result.users);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const handleComment = () => {
    const userid = localStorage.getItem("userid");
    fetch(`http://localhost:3001/Comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: comment,
        Userid: userid,
        Blogid: blogId,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        alert("Comment added successfully!");
      })
      .catch((err) => console.error("Error fetching data:", err));
  };

  const handleRating = () => {
    const userid = localStorage.getItem("userid");

    fetch(`http://localhost:3001/Rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: rating,
        Userid: userid,
        Blogid: blogId,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Data received from server:", result);
        alert("Blog Rated Successfully");
      })
      .catch((err) => console.error("Error fetching data:", err));
  };

  return (
    <div className="App ">
      <Navbar />
      <div
        className="cardView shrink-0 w-full max-w-sm shadow-2xl bg-base-100"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form
          className="card-body"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="heading" style={{ color: "black" }}>
            {heading}
          </label>
          <label htmlFor="link" style={{ color: "black" }}>
            <figure>
              <img
                src={link}
                alt="car!"
                style={{
                  borderRadius: "20px",
                  height: "400px",
                  width: "800px",
                }}
              />
            </figure>
          </label>
          <label htmlFor="text" style={{ color: "black" }}>
            Posted by: {username}
          </label>
          <label htmlFor="text" style={{ color: "black" }}>
            {text}
          </label>
          <br />
          <br />
          <label htmlFor="text" style={{ color: "black", fontWeight: "bold" }}>
            Add Rating
          </label>
          <div
            className="rating gap-1"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input
              type="radio"
              name="rating"
              className="mask mask-heart bg-red-400"
              checked={rating === 1}
              onChange={() => setRating(1)}
            />
            <input
              type="radio"
              name="rating"
              className="mask mask-heart bg-orange-400"
              checked={rating === 2}
              onChange={() => setRating(2)}
            />
            <input
              type="radio"
              name="rating"
              className="mask mask-heart bg-yellow-400"
              checked={rating === 3}
              onChange={() => setRating(3)}
            />
            <input
              type="radio"
              name="rating"
              className="mask mask-heart bg-lime-400"
              checked={rating === 4}
              onChange={() => setRating(4)}
            />
            <input
              type="radio"
              name="rating"
              className="mask mask-heart bg-green-400"
              checked={rating === 5}
              onChange={() => setRating(5)}
            />
          </div>
          <button
            className="btn"
            onClick={handleRating}
            style={{ color: "black" }}
          >
            Rate
          </button>
          <br />
          <label htmlFor="link" style={{ color: "black", fontWeight: "bold" }}>
            Add Comment
          </label>
          <input
            type="text"
            id="comment"
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="btn"
            onClick={handleComment}
            style={{ color: "black" }}
          >
            Comment
          </button>
          <br />
          <br />
          <label htmlFor="link" style={{ color: "black", fontWeight: "bold" }}>
            Comments
          </label>
          <div style={{ color: "black" }}>
            {comments.map((c) => {
              const user = users.find((u) => u._id === c.Userid);

              if (user) {
                return (
                  <div style={{ border: "solid 1px white" }} key={c._id}>
                    <span id={c._id} key={c._id}>
                      Blogger &nbsp;{user.username} commented &nbsp; {c.Comment}
                    </span>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </form>
      </div>
    </div>
  );
}

export default View;
