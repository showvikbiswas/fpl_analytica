import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const Home = ({ isAuthenticated, user }) => {
  return (
    <div className="bg-light p-5 rounded-lg m-3">
      <h1 className="display-4">Welcome to FPL Analytica</h1>
      <p className="lead">Fantasy Premier League, reimagined.</p>
      <hr className="my-4" />
      {user === null ? <p></p> : <p>You are logged in as {user.name}.</p>}
      {!isAuthenticated ? (
        <Link className="btn btn-primary btn-lg" to="/login">
          Login
        </Link>
      ) : (
        <></>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(Home);
