import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          YelpCamp
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
            <NavLink to="/campgrounds" className="nav-link">
              Campgrounds
            </NavLink>
            {user && (
              <NavLink to="/campgrounds/new" className="nav-link">
                New Campground
              </NavLink>
            )}
          </div>

          <div className="navbar-nav ms-auto">
            {user ? (
              <>
                <span className="navbar-text me-lg-3">Signed in as {user.username}</span>
                <button onClick={logout} className="nav-link btn btn-link logout-link">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-link">
                  Log In
                </NavLink>
                <NavLink to="/register" className="nav-link">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
