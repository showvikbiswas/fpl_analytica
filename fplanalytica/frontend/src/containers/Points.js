import React from "react";
import { loadUser } from "../actions/user";
import { connect } from "react-redux";
import Results from "../components/Results";
import GWPoints from "../components/GWPoints";

const Points = ({ isAuthenticated, user, userProfile, loadUser }) => {


  if (isAuthenticated && user !== null && userProfile == null) {
    loadUser(user.id);
  }

  return (
    <div class="container">
      <div class="row">
        <div class="col">
          <GWPoints userProfile={userProfile} />
        </div>
        <div class="col-5">
          <Results />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  userProfile: state.user.user,
});

export default connect(mapStateToProps, { loadUser })(Points);
