import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function NavBar() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  return (
    <nav className="nav">
      <div className="row" style={{ gap: 12 }}>
        <Link to="/books" className="brand">📚 Book Buddy</Link>
        <NavLink to="/books">Catalog</NavLink>
      </div>
      <div className="row" style={{ gap: 8 }}>
        {user ? (
          <>
            <NavLink to="/account">Hi, {user.name || user.email}</NavLink>
            <button className="btn" onClick={logout}>Log out</button>
          </>
        ) : (
          <NavLink className="btn" to="/auth" state={{ from: loc.pathname }}>
            Log in / Register
          </NavLink>
        )}
      </div>
    </nav>
  );
}
