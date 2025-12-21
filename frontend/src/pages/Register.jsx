import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMsg("");
    const n = name.trim();
    const em = email.trim().toLowerCase();
    const pw = password.trim();
    if (!n || !em || !pw) {
      setError("All fields required");
      return;
    }
    if (pw.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/api/auth/register", { name: n, email: em, password: pw });
      setMsg(res.data?.message || "Registered. Please login.");
      navigate("/login");
    } catch (err) {
      const msg = err?.response?.data?.message || (err?.message?.includes("Network") ? "Cannot reach server" : "Registration failed");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container page-center">
      <div className="card" style={{ maxWidth: 440, margin: "0 auto" }}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="form">
          <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} type="text" />
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          <input className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          <button className="btn" type="submit" disabled={loading}>{loading ? "Please wait..." : "Register"}</button>
        </form>
        {msg && <p className="success">{msg}</p>}
        {error && <p className="error">{error}</p>}
        <p style={{ marginTop: 8 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
