import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3001/BlogUsers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok || response.status === 200) {
        if (data.err) {
          alert("Cannot login: Your account is disabled!");
        } else {
          if (data && data.token) {
            console.log("Login successful:", data);
            localStorage.setItem("token", data.token);
            localStorage.setItem("email", data.email);
            localStorage.setItem("username", data.username);
            localStorage.setItem("userid", data.id);
            localStorage.setItem("password", data.password);
          } else {
            console.error("Login failed. Unexpected response format:", data);
          }
        }
      } else {
        console.error("Login failed:", data.err);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/blog");
    }
  }, [navigate]);

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
            Login Please
          </h1>
          <p className="py-6" style={{ color: "Black" }}>
            Welcome Back to Bloggima!
          </p>
        </div>
        <div className="cardRegister shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body">
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
                type="text"
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
                onClick={handleLogin}
                style={{ width: "200px" }}
              >
                Login
              </button>
            </div>
            <div className="form-control mt-4">
              <button
                className="btn btn-outline"
                style={{ width: "200px" }}
                onClick={() => navigate("/register")}
              >
                Signup
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
