import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { loadGWTeam } from "../actions/gameweek";
import { connect } from "react-redux";
import { removePlayerFromGWTeam } from "../actions/gameweek";
import { resetGWTeam } from "../actions/gameweek";
import { confirmGWTransfers } from "../actions/gameweek";
import { showError } from "../actions/errors";
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
  showError,
}) => {
  const [GKEmptySlots, setGKEmptySlots] = useState([]);
  const [DEFEmptySlots, setDEFEmptySlots] = useState([]);
  const [MIDEmptySlots, setMIDEmptySlots] = useState([]);
  const [FWDEmptySlots, setFWDEmptySlots] = useState([]);
  const [newFreeTransfers, setNewFreeTransfers] = useState(0);
  const [cost, setCost] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [budgetAvailable, setBudgetAvailable] = useState(false);

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
        GKEmptySlots.push(
          <tr>
            <th scope="row">Empty Slot</th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        );
      }
      setGKEmptySlots(GKEmptySlots);

      for (let i = 0; i < 5 - DEFs; i++) {
        DEFEmptySlots.push(
          <tr>
            <th scope="row">Empty Slot</th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        );
      }
      setDEFEmptySlots(DEFEmptySlots);

      for (let i = 0; i < 5 - MIDs; i++) {
        MIDEmptySlots.push(
          <tr>
            <th scope="row">Empty Slot</th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        );
      }
      setMIDEmptySlots(MIDEmptySlots);

      for (let i = 0; i < 3 - FWDs; i++) {
        FWDEmptySlots.push(
          <tr>
            <th scope="row">Empty Slot</th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        );
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

  useEffect(() => {
    if (newBudget < 0) {
      setBudgetAvailable(false);
    } else {
      setBudgetAvailable(true);
    }
  }, [newBudget]);

  if (confirmed) {
    return <Navigate to="/" />;
  }

  const removePlayer = (e, player) => {
    console.log(player.FULLNAME);

    removePlayerFromGWTeam(player, newBudget);
  };

  const resetPlayers = (e) => {
    resetGWTeam(userProfile.BUDGET);
  };

  const confirmTransfers = (e) => {
    if (newBudget < 0) {
      showError("Team has surpassed available budget.");
      return;
    }

    if (newTeam.length < 15) {
      showError("Not enough players selected.");
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
        // <Fragment>
        //   <h5>{"Free Transfers: " + newFreeTransfers}</h5>
        //   <h5>{"Cost: " + cost}</h5>
        //   <h5>{"Budget Remaining: " + newBudget}</h5>
        // </Fragment>

        <div class="container">
          <div class="row">
            <div class="col">
              <hr />
            </div>
            <div class="col">
              <hr />
            </div>
            <div class="col">
              <hr />
            </div>
          </div>

          <div class="row">
            <div class="col">
              <p class={"text-center"}>Free Transfers</p>
              <h4 class="text-center">{newFreeTransfers}</h4>
            </div>
            <div class="col">
              <p class="text-center">Cost</p>
              <h4 class="text-center">{cost + " pts"}</h4>
            </div>
            <div class="col">
              <p class="text-center">Money Remaining</p>
              <h4
                class={
                  "text-center" +
                  " " +
                  (budgetAvailable ? "text-success" : "text-danger")
                }
              >
                {newBudget}
              </h4>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <hr />
            </div>
            <div class="col">
              <hr />
            </div>
            <div class="col">
              <hr />
            </div>
          </div>
        </div>
      )}

      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Goalkeepers</th>
            <th scope="col">Club</th>
            <th scope="col">CP</th>
            <th scope="col">TP</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {newTeam === null ? (
            <></>
          ) : (
            newTeam.map((player) => {
              if (player.ELEMENT_TYPE == "GK") {
                return (
                  <tr>
                    <th scope="row" style={{ width: "30%" }}>
                      {player.FULLNAME}
                    </th>
                    <td style={{ width: "20%" }}>{player.TEAM}</td>
                    <td style={{ width: "10%" }}>{player.NOW_COST}</td>
                    <td style={{ width: "10%" }}>{player.TOTAL_POINTS}</td>
                    <td style={{ width: "20%" }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={(e) => removePlayer(e, player)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              }
            })
          )}
          {GKEmptySlots}
        </tbody>
      </table>

      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Defenders</th>
            <th scope="col">Club</th>
            <th scope="col">CP</th>
            <th scope="col">TP</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {newTeam === null ? (
            <></>
          ) : (
            newTeam.map((player) => {
              if (player.ELEMENT_TYPE == "DEF") {
                return (
                  <tr>
                    <th scope="row" style={{ width: "30%" }}>
                      {player.FULLNAME}
                    </th>
                    <td style={{ width: "20%" }}>{player.TEAM}</td>
                    <td style={{ width: "10%" }}>{player.NOW_COST}</td>
                    <td style={{ width: "10%" }}>{player.TOTAL_POINTS}</td>
                    <td style={{ width: "20%" }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={(e) => removePlayer(e, player)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              }
            })
          )}
          {DEFEmptySlots}
        </tbody>
      </table>

      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Midfielders</th>
            <th scope="col">Club</th>
            <th scope="col">CP</th>
            <th scope="col">TP</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {newTeam === null ? (
            <></>
          ) : (
            newTeam.map((player) => {
              if (player.ELEMENT_TYPE == "MID") {
                return (
                  <tr>
                    <th scope="row" style={{ width: "30%" }}>
                      {player.FULLNAME}
                    </th>
                    <td style={{ width: "20%" }}>{player.TEAM}</td>
                    <td style={{ width: "10%" }}>{player.NOW_COST}</td>
                    <td style={{ width: "10%" }}>{player.TOTAL_POINTS}</td>
                    <td style={{ width: "20%" }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={(e) => removePlayer(e, player)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              }
            })
          )}
          {MIDEmptySlots}
        </tbody>
      </table>

      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Forwards</th>
            <th scope="col">Club</th>
            <th scope="col">CP</th>
            <th scope="col">TP</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {newTeam === null ? (
            <></>
          ) : (
            newTeam.map((player) => {
              if (player.ELEMENT_TYPE == "FWD") {
                return (
                  <tr>
                    <th scope="row" style={{ width: "30%" }}>
                      {player.FULLNAME}
                    </th>
                    <td style={{ width: "20%" }}>{player.TEAM}</td>
                    <td style={{ width: "10%" }}>{player.NOW_COST}</td>
                    <td style={{ width: "10%" }}>{player.TOTAL_POINTS}</td>
                    <td style={{ width: "20%" }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={(e) => removePlayer(e, player)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              }
            })
          )}
          {FWDEmptySlots}
        </tbody>
      </table>

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
  showError,
})(Team);
