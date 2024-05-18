import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/login.css";
import axios from "axios";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile_no, setMobile_no] = useState("");
  const [, setShow] = useState(false);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `http://ec2-54-204-149-34.compute-1.amazonaws.com/api/Auth/Register`,
        {
          name: username,
          email: email,
          password: password,
          mobile_no: mobile_no,
          IsActive: true,
        }
      );
      if (response.status === 200) {
        navigate("/");
      } else {
        setShow(true);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="login-box">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="user-box">
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Username</label>
        </div>
        <div className="user-box">
          <input
            type="text"
            name="email"
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
        <div className="user-box">
          <input
            type="number"
            name="mobile_no"
            value={mobile_no}
            onChange={(e) => setMobile_no(e.target.value)}
            required
          />
          <label>Mobile NO.</label>
        </div>
        <button type="submit">
          <span></span>
          <span></span>
          Register
        </button>
      </form>
      <br />
      <p className="text-white">
        Already Registered ? <Link to="/"> Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
