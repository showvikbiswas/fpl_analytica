import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { logout } from "../actions/auth";
import { connect } from "react-redux";

const Navbar = ({ logout, isAuthenticated }) => {
  const guestLinks = () => {
    return (
      <Fragment>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/signup">
            Signup
          </Link>
        </li>
      </Fragment>
    );
  };

  const authLinks = () => {
    return (
      <Fragment>
        <li className="nav-item">
          <Link className="nav-link" to="/points">
            Points
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/my-team">
            Pick Team
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/transfers">
            Transfers
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/leagues">
            Leagues
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/" onClick={logout}>
            Logout
          </Link>
        </li>
      </Fragment>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          FPL Analytica
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
            </li>
            {isAuthenticated ? authLinks() : guestLinks()}
          </ul>
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(Navbar);
