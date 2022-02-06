import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { loadUser } from "../actions/user";
import { createUserLeague } from "../actions/leagues";

const CreateLeague = ({ isAuthenticated, user, loadUser, userProfile }) => {
  if (isAuthenticated && user !== null && userProfile == null) {
    loadUser(user.id);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    createUserLeague(name, user.id);
    setLeagueCreated(true);
  };

  const [formData, setFormData] = useState({
    name: "",
  });

  const [leagueCreated, setLeagueCreated] = useState(false);

  const { name } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (leagueCreated) {
    return <Navigate to="/leagues"></Navigate>;
  }

  return (
    <div>
      <div className="container mt-5">
        <h3>Create League</h3>
        <p>Maximum 30 characters</p>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-group mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="League Name"
              name="name"
              value={name}
              onChange={(e) => onChange(e)}
              required
              minLength="1"
              maxLength="30"
            ></input>
          </div>
          <button className="btn btn-primary mr-1" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  userProfile: state.user.user,
});

export default connect(mapStateToProps, { loadUser })(CreateLeague);
