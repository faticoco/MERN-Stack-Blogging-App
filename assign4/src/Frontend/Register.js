import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/blog");
    }
  }, [navigate]);

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:3001/BlogUsers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log("Registration successful:", data);
        localStorage.setItem("token", data.token);
        const token = localStorage.getItem("token");
        if (token) {
          navigate("/");
        }
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData.err);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div
      className="hero min-h-screen bg-base-200"
      style={{
        width: "100%",
        height: "45pc",
        backgroundImage: `url(
          "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        )`,
      }}
    >
      <div className="hero-content flex-col lg:flex-row-reverse flex">
        <div className="text-center lg:text-left">
          <h1 style={{ color: "Black", fontSize: "50px", fontWeight: "bold" }}>
            Register now!
          </h1>
          <br />
          <p className="py-6" style={{ color: "Black" }}>
            Join Bloggima for a Seamless Blogging Experience
            <br></br>A home for Bloggers all around the world, where you can
            share your stories and make people smile
          </p>
        </div>
        <div
          className="cardRegister shrink-0 w-full max-w-sm shadow-2xl bg-base-100"
          style={{ border: "2px white solid" }}
        >
          <form className="card-body">
            <div className="form-control">
              <label className="label">
                <span
                  className="label-text"
                  style={{ color: "Black", fontWeight: "bold" }}
                >
                  Username
                </span>
              </label>
              <input
                style={{ backgroundColor: "white" }}
                type="username"
                placeholder="username"
                className="input input-bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span
                  className="label-text"
                  style={{ color: "Black", fontWeight: "bold" }}
                >
                  Email
                </span>
              </label>
              <input
                style={{ backgroundColor: "white" }}
                type="email"
                placeholder="email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span
                  className="label-text"
                  style={{ color: "Black", fontWeight: "bold" }}
                >
                  Password
                </span>
              </label>
              <input
                style={{ backgroundColor: "white" }}
                type="password"
                placeholder="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-6">
              <button
                className="btn btn-primary"
                onClick={handleRegister}
                style={{ width: "200px" }}
              >
                Sign Up
              </button>
            </div>
            <div className="form-control mt-6">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/")}
                style={{ width: "200px" }}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
