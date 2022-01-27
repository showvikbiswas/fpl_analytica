import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { loadGWTeam } from "../actions/gameweek";
import { connect } from "react-redux";
import { removePlayerFromGWTeam } from "../actions/gameweek";
import { resetGWTeam } from "../actions/gameweek";

const Team = ({
  userProfile,
  loadGWTeam,
  team,
  newTeam,
  removePlayerFromGWTeam,
  resetGWTeam,
}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  useEffect(() => {
    if (userProfile === null) {
      return;
    }

    loadGWTeam(userProfile.USER_ID);
  }, [userProfile]);

  const removePlayer = (e, player) => {
    console.log(player.FULLNAME);

    removePlayerFromGWTeam(player);
  };

  const resetPlayers = (e) => {
    resetGWTeam();
  };

  return (
    <div>
      <ul class="list-group">
        {newTeam === null ? (
          <></>
        ) : (
          newTeam.map((player) => {
            return (
              <li class="list-group-item">
                <div class="d-flex justify-content-between">
                  {player.FULLNAME} {"   "} {player.ELEMENT_TYPE}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => removePlayer(e, player)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
      <button
        type="button"
        className="btn btn-primary"
        onClick={(e) => resetPlayers(e)}
      >
        Reset
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  team: state.gameweek.team,
  newTeam: state.gameweek.newTeam,
});

export default connect(mapStateToProps, {
  loadGWTeam,
  removePlayerFromGWTeam,
  resetGWTeam,
})(Team);
