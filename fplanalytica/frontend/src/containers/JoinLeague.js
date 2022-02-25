import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { loadUser } from "../actions/user";
import { joinUserLeague } from "../actions/leagues";
import { showError } from "../actions/errors";

const JoinLeague = ({
  isAuthenticated,
  user,
  loadUser,
  userProfile,
  joinUserLeague,
  showError,
}) => {
  if (isAuthenticated && user !== null && userProfile == null) {
    loadUser(user.id);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await joinUserLeague(name, user.id);
    if (res === "league not found" || res === "already joined") {
      showError(res);
      return;
    }
    setLeagueJoined(true);
  };

  const [formData, setFormData] = useState({
    name: "",
  });

  const [leagueJoined, setLeagueJoined] = useState(false);

  const { name } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (leagueJoined) {
    return <Navigate to="/leagues"></Navigate>;
  }

  return (
    <div>
      <div className="container mt-5">
        <h3>Enter League Code</h3>
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
              minLength="6"
              maxLength="6"
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

export default connect(mapStateToProps, {
  loadUser,
  joinUserLeague,
  showError,
})(JoinLeague);
