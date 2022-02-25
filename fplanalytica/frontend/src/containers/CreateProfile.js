import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { completeRegistration } from "../actions/user";
import { loadTeams } from "../actions/teams";

const CreateProfile = ({
  isAuthenticated,
  user,
  userProfile,
  completeRegistration,
  loadTeams,
  teams,
}) => {
  useEffect(() => {
    loadTeams();
  }, []);
  const [accountFinalized, setAccountFinalized] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    favclub: "",
    fplteam: "",
  });

  const { name, age, favclub, fplteam } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    completeRegistration(age, favclub, fplteam, user.email, user.id, user.name);
    setAccountFinalized(true);
  };

  if (accountFinalized) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mt-5">
      <h1>Complete Your Account</h1>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-group mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="Name"
            name="name"
            value={user ? user.name : "placeholder"}
            readOnly
            required
          ></input>
        </div>

        <div className="form-group mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="Age"
            name="age"
            value={age}
            onChange={(e) => onChange(e)}
            required
          ></input>
        </div>

        {/* <div className="form-group mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="Favourite Club"
            name="favclub"
            value={favclub}
            onChange={(e) => onChange(e)}
            required
            minLength="6"
          ></input>
        </div> */}

        <div className="form-group mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="FPL Team Name"
            name="fplteam"
            value={fplteam}
            onChange={(e) => onChange(e)}
            required
            minLength="6"
          ></input>
        </div>

        <div className="form-group mb-3">
          <select
            className="form-select form-select-lg mb-3 size=3"
            aria-label=".form-select-lg example"
            name="favclub"
            onChange={(e) => onChange(e)}
          >
            <option selected>Select Team</option>
            {teams.map((team) => (
              <option value={team.NAME}>{team.NAME}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary mr-1" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  userProfile: state.user.user,
  teams: state.teams.teams,
});

export default connect(mapStateToProps, { completeRegistration, loadTeams })(
  CreateProfile
);
