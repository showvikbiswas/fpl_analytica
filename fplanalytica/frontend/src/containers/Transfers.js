import React from "react";
import { loadUser } from "../actions/user";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import Searchbar from "../components/Searchbar";
import BookData from "../components/data.json";
import PlayerSelection from "../components/PlayerSelection";
import Team from "../components/Team";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Transfers = ({ isAuthenticated, user, userProfile, loadUser }) => {
  const [players, setPlayers] = useState([]);
  const [playerList, setPlayerList] = useState([]);

  if (isAuthenticated && user !== null && userProfile == null) {
    loadUser(user.id);
  }

  return (
    <div class="container">
      <div class="row">
        <div class="col">
          <Team userProfile={userProfile} />
        </div>
        <div class="col-5">
          <PlayerSelection />
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

export default connect(mapStateToProps, { loadUser })(Transfers);
