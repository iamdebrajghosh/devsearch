import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const isAuthed = !!localStorage.getItem("accessToken");
  function logout() {
    localStorage.removeItem("accessToken");
    navigate("/login");
  }
  return (
    <div>
      <header className="header">
        <nav className="nav">
          <div className="brand">DevSearch</div>
          <NavLink to="/jobs" className={({ isActive }) => (isActive ? "active" : "")}>Jobs</NavLink>
          <NavLink to="/upload" className={({ isActive }) => (isActive ? "active" : "")}>Upload Resume</NavLink>
          {isAuthed ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <button onClick={() => navigate("/login")}>Login</button>
          )}
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
