import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { loadGWTeam } from "../actions/gameweek";
import { connect } from "react-redux";
import { removePlayerFromGWTeam } from "../actions/gameweek";
import { resetGWTeam } from "../actions/gameweek";
import { confirmGWTransfers } from "../actions/gameweek";
import { Navigate } from "react-router-dom";

var initialFT = 0;

const Team = ({
  userProfile,
  loadGWTeam,
  team,
  newTeam,
  newBudget,
  removePlayerFromGWTeam,
  resetGWTeam,
  confirmGWTransfers,
}) => {
  const [GKEmptySlots, setGKEmptySlots] = useState([]);
  const [DEFEmptySlots, setDEFEmptySlots] = useState([]);
  const [MIDEmptySlots, setMIDEmptySlots] = useState([]);
  const [FWDEmptySlots, setFWDEmptySlots] = useState([]);
  const [newFreeTransfers, setNewFreeTransfers] = useState(0);
  const [cost, setCost] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (userProfile === null) {
      return;
    }
    setNewFreeTransfers(userProfile.FREE_TRANSFERS);
    initialFT = userProfile.FREE_TRANSFERS;
    console.log(initialFT);
    loadGWTeam(userProfile);
  }, [userProfile]);

  useEffect(() => {
    if (newTeam !== null) {
      const GKEmptySlots = [];
      const DEFEmptySlots = [];
      const MIDEmptySlots = [];
      const FWDEmptySlots = [];

      var GKs = 0,
        DEFs = 0,
        MIDs = 0,
        FWDs = 0;
      newTeam.map((player) => {
        // switch (player.ELEMENT_TYPE) {
        //   case "GK":
        //     console.log("GK");
        //     GKs++;
        //   case "DEF":
        //     console.log("DEF");
        //     DEFs++;
        //   case "MID":
        //     MIDs++;
        //   case "FWD":
        //     console.log("FWD");
        //     FWDs++;
        //   default:
        // }

        if (player.ELEMENT_TYPE == "GK") {
          GKs++;
        } else if (player.ELEMENT_TYPE == "DEF") {
          DEFs++;
        } else if (player.ELEMENT_TYPE == "MID") {
          MIDs++;
        } else if (player.ELEMENT_TYPE == "FWD") {
          FWDs++;
        }
      });

      for (let i = 0; i < 2 - GKs; i++) {
        GKEmptySlots.push(<li class="list-group-item">Empty Slot</li>);
      }
      setGKEmptySlots(GKEmptySlots);

      for (let i = 0; i < 5 - DEFs; i++) {
        DEFEmptySlots.push(<li class="list-group-item">Empty Slot</li>);
      }
      setDEFEmptySlots(DEFEmptySlots);

      for (let i = 0; i < 5 - MIDs; i++) {
        MIDEmptySlots.push(<li class="list-group-item">Empty Slot</li>);
      }
      setMIDEmptySlots(MIDEmptySlots);

      for (let i = 0; i < 3 - FWDs; i++) {
        FWDEmptySlots.push(<li class="list-group-item">Empty Slot</li>);
      }
      setFWDEmptySlots(FWDEmptySlots);

      // set the new free transfers based on the number of differences between team and newTeam redux states
      var usedFT = 0;

      // if absolutely new player
      if (team.length === 0) {
        usedFT += newTeam.length;
      } else {
        usedFT += team.length - newTeam.length;
        for (let i = 0; i < newTeam.length; i++) {
          let found = false;
          for (let j = 0; j < team.length; j++) {
            if (newTeam[i].PLAYER_ID === team[j].PLAYER_ID) {
              found = true;
            }
          }
          if (!found) {
            usedFT++;
          }
        }
      }
      setNewFreeTransfers(initialFT - usedFT);

      if (initialFT - usedFT < 0) {
        setCost(4 * (initialFT - usedFT));
      } else {
        setCost(0);
      }
    }
  }, [newTeam]);

  if (confirmed) {
    return <Navigate to="/" />;
  }

  const removePlayer = (e, player) => {
    console.log(player.FULLNAME);

    removePlayerFromGWTeam(player, newBudget);
  };

  const resetPlayers = (e) => {
    resetGWTeam();
  };

  const confirmTransfers = (e) => {
    if (newBudget < 0) {
      console.log("Team has surpassed available budget.");
      return;
    }

    if (newTeam.length < 15) {
      console.log("Not enough players selected.");
      return;
    }
    confirmGWTransfers(
      userProfile.USER_ID,
      newBudget,
      newFreeTransfers,
      newTeam,
      cost
    );

    setConfirmed(true);
  };

  return (
    <div>
      {userProfile === null ? (
        <></>
      ) : (
        <Fragment>
          <h5>{"Free Transfers: " + newFreeTransfers}</h5>
          <h5>{"Cost: " + cost}</h5>
          <h5>{"Budget Remaining: " + newBudget}</h5>
        </Fragment>
      )}

      <h4>Goalkeepers</h4>
      <ul class="list-group">
        {newTeam === null ? (
          <></>
        ) : (
          newTeam.map((player) => {
            if (player.ELEMENT_TYPE == "GK") {
              return (
                <li class="list-group-item">
                  <div class="d-flex justify-content-between">
                    {player.FULLNAME} {"|"} {player.TEAM}
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
            }
          })
        )}
        {GKEmptySlots}
      </ul>

      <h4>Defenders</h4>
      <ul class="list-group">
        {newTeam === null ? (
          <></>
        ) : (
          newTeam.map((player) => {
            if (player.ELEMENT_TYPE == "DEF") {
              return (
                <li class="list-group-item">
                  <div class="d-flex justify-content-between">
                    {player.FULLNAME} {"|"} {player.TEAM}
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
            }
          })
        )}
        {DEFEmptySlots}
      </ul>

      <h4>Midfielders</h4>
      <ul class="list-group">
        {newTeam === null ? (
          <></>
        ) : (
          newTeam.map((player) => {
            if (player.ELEMENT_TYPE == "MID") {
              return (
                <li class="list-group-item">
                  <div class="d-flex justify-content-between">
                    {player.FULLNAME} {"|"} {player.TEAM}
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
            }
          })
        )}
        {MIDEmptySlots}
      </ul>

      <h4>Forwards</h4>
      <ul class="list-group">
        {newTeam === null ? (
          <></>
        ) : (
          newTeam.map((player) => {
            if (player.ELEMENT_TYPE == "FWD") {
              return (
                <li class="list-group-item">
                  <div class="d-flex justify-content-between">
                    {player.FULLNAME} {"|"} {player.TEAM}
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
            }
          })
        )}
        {FWDEmptySlots}
      </ul>
      <button
        type="button"
        className="btn btn-primary mt-3"
        onClick={(e) => resetPlayers(e)}
      >
        Reset
      </button>

      <button
        type="button"
        className="btn btn-primary mt-3 ml-3"
        onClick={(e) => confirmTransfers(e)}
      >
        Confirm
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  team: state.gameweek.team,
  newTeam: state.gameweek.newTeam,
  newBudget: state.gameweek.newBudget,
});

export default connect(mapStateToProps, {
  loadGWTeam,
  removePlayerFromGWTeam,
  resetGWTeam,
  confirmGWTransfers,
})(Team);
