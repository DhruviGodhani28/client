import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/login.css";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setShow] = useState(false);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `http://ec2-54-204-149-34.compute-1.amazonaws.com/api/Auth/login`,
        {
          email: email,
          password: password,
        }
      );

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);

      
          navigate("/dashboard");
        
      } else {
        setShow(true);
      }
    } catch (error) {
      setShow(true);
    }

    setLoading(false);
  };

  return (
    <div className="login-box">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="user-box">
          <input
            type="text"
            name="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Email</label>
        </div>
        <div className="user-box">
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Password</label>
        </div>
        <button type="submit">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Login
        </button>
      </form>
      <br />
      <p className="text-white">
        Don't have Account ? <Link to="/register"> Create Account</Link>
      </p>
    </div>
  );
}

export default LoginPage;
