import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import "./App.css";

import React, { useState, useEffect } from "react";

function Blog() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [sortByUsername, setSortByUsername] = useState(false);
  const [filterByBlogger, setFilterByBlogger] = useState("");
  const [filterByHeading, setFilterByHeading] = useState("");
  const [search, setSearch] = useState("");
  const [following, setFollowing] = useState(false);

  const [pagenum, setPagenum] = useState(1);

  useEffect(() => {
    if (search === "") {
      fetch(`http://localhost:3001/Blogs/pages/${pagenum}`)
        .then((response) => response.json())
        .then((result) => {
          console.log("Data received from server:", result);
          setData(result.blogs);
        })
        .catch((err) => console.error("Error fetching blogs:", err));
    } else {
      HandleSearch();
    }
  }, [search]);

  const handleFilterByBlogger = () => {
    if (filterByBlogger == "") {
      fetch(`http://localhost:3001/Blogs/pages/${pagenum}`)
        .then((response) => response.json())
        .then((result) => {
          console.log("Data received from server:", result);
          setData(result.blogs);
        })
        .catch((err) => console.error("Error fetching blogs:", err));
    } else {
      fetch(`http://localhost:3001/Blog/filterbyusername/${filterByBlogger}`)
        .then((response) => response.json())
        .then((result) => {
          if (result.length > 0) {
            fetch("http://localhost:3001/Blogs/getall")
              .then((response) => response.json())
              .then((result) => {
                console.log("Data received from server:", result);
                setData(result);
              })
              .catch((err) => console.error("Error fetching blogs:", err));
          } else {
            console.log("Data received from server:", result);
            setData(result.totalBlogs);
          }
        })
        .catch((err) => console.error("Error fetching blogs:", err));
    }
  };

  const handleFilterByHeading = () => {
    if (filterByHeading == "") {
      fetch("http://localhost:3001/Blogs/getall")
        .then((response) => response.json())
        .then((result) => {
          console.log("Data received from server:", result);
          setData(result);
        })
        .catch((err) => console.error("Error fetching blogs:", err));
    } else {
      fetch(`http://localhost:3001/Blog/filterbytitle/${filterByHeading}`)
        .then((response) => response.json())
        .then((result) => {
          console.log("Data received from server:", result);
          setData(result.totalBlogs);
        })
        .catch((err) => console.error("Error fetching blogs:", err));
    }
  };

  const sortbyusernamefunc = (sort) => {
    console.log(pagenum);
    sort = !sortByUsername;
    if (sort) {
      fetch("http://localhost:3001/Blogs/sortbyusername")
        .then((response) => response.json())
        .then((result) => {
          console.log("Data received from server:", result);
          setData(result.totalBlogs);
        })
        .catch((err) => console.error("Error fetching blogs:", err));
      setSortByUsername(sort);
    } else {
      fetch(`http://localhost:3001/Blogs/pages/${pagenum}`)
        .then((response) => response.json())
        .then((result) => {
          console.log("Data received from server:", result);
          setData(result.blogs);
        })
        .catch((err) => console.error("Error fetching blogs:", err));
      setSortByUsername(sort);
    }
  };

  const handleDelete = (blogId) => {
    const blogElement = document.getElementById(`${blogId}`);

    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    fetch(`http://localhost:3001/Blog/${blogId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        creatoremail: email,
        creatorusername: username,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.msg) {
          alert("Cannot delete Blog you do not own!");
        } else {
          console.log("Data received from server:", result);

          alert("Blog Successfully Deleted");
          blogElement.remove();
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  };

  const handleUpdate = (blogId) => {
    console.log(`Updating blog with ID: ${blogId}`);
    const updateUrl = `/update/${blogId}`;

    navigate(updateUrl);
  };

  const handlefollow = (email) => {
    const user_email = localStorage.getItem("email");
    console.log(user_email, email);

    fetch(`http://localhost:3001/BlogUsers/follow/${email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email: user_email,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message) {
          alert(result.message);
        } else {
          console.log("Data received from server:", result);
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  };
  const handleView = (blogId) => {
    const updateUrl = `/view/${blogId}`;

    navigate(updateUrl);
  };

  const HandleSearch = () => {
    fetch(`http://localhost:3001/Blog/search/${search}`)
      .then((response) => response.json())
      .then((result) => {
        console.log("Data received from server:", result);
        setData(result.totalBlogs);
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  };

  const setPagenumfunc = (page) => {
    setPagenum(page);
    fetch(`http://localhost:3001/Blogs/pages/${pagenum}`)
      .then((response) => response.json())
      .then((result) => {
        console.log("Data received from server:", result);
        setData(result.blogs);
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  };

  const handleFollowing = () => {
    setFollowing(!following);

    if (following) {
      fetch(`http://localhost:3001/Blogs/pages/${pagenum}`)
        .then((response) => response.json())
        .then((result) => {
          console.log("Data received from server:", result);
          setData(result.blogs);
        })
        .catch((err) => console.error("Error fetching blogs:", err));
    } else {
      const email = localStorage.getItem("email");
      fetch(`http://localhost:3001/BlogUsers/feed/${email}`)
        .then((response) => response.json())
        .then((result) => {
          console.log("Data received from server:", result);
          setData(result.blogs);
        })
        .catch((err) => console.error("Error fetching blogs:", err));
    }
  };

  return (
    <div className="App ">
      <Navbar />

      <div className="flex flex-wrap">
        {/* //filter sort options menu bar*/}
        <div
          className="form-control"
          style={{
            border: "2px solid white",
            color: "Black",
            padding: "20px",
            margin: "0px",
            borderRadius: "20px",
            marginLeft: "50px",
          }}
        >
          <h1 style={{ fontWeight: "bold" }}>Menu</h1>
          <label
            className="cursor-pointer label"
            style={{
              borderRadius: "20px",
              marginTop: "20px",
            }}
          >
            <span className="label-text" style={{ color: "Black" }}>
              Search
            </span>

            <div>
              <input
                type="text"
                placeholder="Search..."
                className="input input-bordered"
                style={{
                  background: "white",
                  height: "40px",
                  width: "200px",
                  borderRadius: "40px",
                }}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </label>
          <label
            className="cursor-pointer label"
            style={{
              border: "2px solid white",
              borderRadius: "20px",
              marginTop: "20px",
            }}
          >
            <span className="label-text" style={{ color: "Black" }}>
              Sort By username
            </span>
            <input
              type="checkbox"
              className="checkbox checkbox-secondary"
              onClick={() => sortbyusernamefunc(sortByUsername)}
            />
          </label>
          <span
            className="label-text"
            style={{ color: "Black", fontWeight: "bold", marginTop: "20px" }}
          >
            Filter By
          </span>
          <label
            className="cursor-pointer label"
            style={{ border: "2px solid white", borderRadius: "20px" }}
          >
            <span className="label-text" style={{ color: "Black" }}>
              Blogger
            </span>

            <input
              type="text"
              style={{
                height: "30px",
                width: "150px",
                borderRadius: "20px",
                marginLeft: "2px",
                marginRight: "2px",
              }}
              onChange={(e) => setFilterByBlogger(e.target.value)}
            />
            <button
              className="btn"
              onClick={handleFilterByBlogger}
              style={{
                border: "2px solid white",
                borderRadius: "20px",
                padding: "5px",
                fontSize: "12px",
                color: "Black",
              }}
            >
              Filter
            </button>
          </label>

          <label
            className="cursor-pointer label"
            style={{
              border: "2px solid white",
              borderRadius: "20px",
              marginTop: "20px",
            }}
          >
            <span className="label-text" style={{ color: "Black" }}>
              Heading
            </span>
            <input
              type="text"
              style={{
                marginLeft: "2px",
                marginRight: "2px",
                width: "150px",
                height: "30px",
                borderRadius: "20px",
              }}
              onChange={(e) => setFilterByHeading(e.target.value)}
            />
            <button
              className="btn"
              onClick={handleFilterByHeading}
              style={{
                border: "2px solid white",
                borderRadius: "20px",
                padding: "5px",
                color: "Black",
                fontSize: "12px",
              }}
            >
              Filter
            </button>
          </label>

          <button
            className="btn"
            onClick={handleFollowing}
            style={{
              height: "40px",
              border: "2px solid white",
              borderRadius: "20px",
              padding: "5px",
              fontSize: "12px",
              marginTop: "20px",
              color: "Black",
              fontWeight: "bold",
            }}
          >
            {following ? "Show all Blogs" : "  Show following Bloggers Posts"}
          </button>
        </div>

        {data.map((d) => (
          <>
            {d.status && (
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
                    Posted By {d.creatorusername}
                    &nbsp; on:{" "}
                    {new Date(d.creationDate).toLocaleDateString("en-US")}
                  </h3>
                  <br></br>
                  <p
                    style={{
                      color: "Black",
                    }}
                  >
                    {d.text}
                  </p>
                  <br />
                  <br></br> <br />
                  <div className="button-container">
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
                      Open
                    </button>
                    <button
                      className="btn"
                      style={{
                        height: "50px",
                        width: "100px",
                        color: "Blue",
                        borderRadius: "50px",
                      }}
                      onClick={() => handlefollow(d.creatoremail)}
                    >
                      Follow
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDelete(d._id)}
                      style={{
                        width: "50px",
                        color: "red",
                        borderRadius: "50px",
                      }}
                    >
                      X
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleUpdate(d._id)}
                      style={{
                        height: "50px",
                        width: "50px",
                        color: "blue",
                        borderRadius: "50px",
                      }}
                    >
                      ...
                    </button>
                  </div>
                </div>
                <br />
              </div>
            )}
          </>
        ))}
        <div
          className="join "
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: "20px",
          }}
        >
          <button
            className="join-item btn btn-outline"
            style={{ color: "Black" }}
            onClick={() => setPagenumfunc((pagenum) => pagenum - 1)}
          >
            Previous
          </button>
          <button
            className="join-item btn btn-outline"
            style={{ color: "Black" }}
            onClick={() => setPagenumfunc((pagenum) => pagenum + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Blog;
