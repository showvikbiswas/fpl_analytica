import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { loadUser } from "../actions/user";

const Home = ({ isAuthenticated, user, loadUser, userProfile }) => {
  if (isAuthenticated && user !== null && userProfile == null) {
    loadUser(user.id);
  }

  if (userProfile) {
    if (userProfile === "none") {
      return <Navigate to="/create-profile"></Navigate>;
    }
  }

  return (
    <div className="bg-light p-5 rounded-lg m-3">
      <h1 className="display-4">Welcome to FPL Analytica</h1>
      <p className="lead">Fantasy Premier League, reimagined.</p>
      <hr className="my-4" />
      {userProfile === null ? (
        <p></p>
      ) : (
        <div>
          <h3>You are logged in as {userProfile.NAME}.</h3>
          <p>Your team name is {userProfile.TEAM_NAME}.</p>
        </div>
      )}
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
  userProfile: state.user.user,
});

export default connect(mapStateToProps, { loadUser })(Home);
