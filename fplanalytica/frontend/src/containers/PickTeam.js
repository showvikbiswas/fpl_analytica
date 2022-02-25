import React from "react";
import { loadUser } from "../actions/user";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import PlayerSelection from "../components/PlayerSelection";
import PlayingTeam from "../components/PlayingTeam";
import Fixtures from "../components/Fixtures";
import axios from "axios";
import { Navigate } from "react-router-dom";

const PickTeam = ({ isAuthenticated, user, userProfile, loadUser }) => {
  const [players, setPlayers] = useState([]);
  const [playerList, setPlayerList] = useState([]);

  if (isAuthenticated && user !== null && userProfile == null) {
    loadUser(user.id);
  }

  return (
    <div class="container">
      <div class="row">
        <div class="col">
          <PlayingTeam userProfile={userProfile} />
        </div>
        <div class="col-5">
          <Fixtures />
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

export default connect(mapStateToProps, { loadUser })(PickTeam);
