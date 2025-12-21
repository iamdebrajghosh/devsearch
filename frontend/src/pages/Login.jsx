import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const em = email.trim().toLowerCase();
    const pw = password.trim();
    if (!em || !pw) {
      setError("Email and password required");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", { email: em, password: pw }, { withCredentials: true });
      const token = res.data?.accessToken;
      if (token) {
        localStorage.setItem("accessToken", token);
        navigate("/jobs");
      } else {
        setError("Login failed");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || (err?.message?.includes("Network") ? "Cannot reach server" : "Invalid credentials");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container page-center">
      <div className="card" style={{ maxWidth: 440, margin: "0 auto" }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="form">
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          <input className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          <button className="btn" type="submit" disabled={loading}>{loading ? "Please wait..." : "Login"}</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p style={{ marginTop: 8 }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
