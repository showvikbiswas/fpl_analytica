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
import {
  changePlayingTeam,
  confirmPlayingTeam,
  changeCaptain,
  changeViceCaptain,
  resetPlayingTeam,
} from "../actions/gameweek";
import "./Component.css";
import PlayerModal from "./modals/PlayerModal";

const PlayingTeam = ({
  userProfile,
  loadGWTeam,
  team,
  newTeam,
  playingTeam,
  newPlayingTeam,
  subs,
  newSubs,
  captain,
  newCaptain,
  viceCaptain,
  newViceCaptain,
  removePlayerFromGWTeam,
  resetGWTeam,
  confirmGWTransfers,
  changePlayingTeam,
  confirmPlayingTeam,
  changeCaptain,
  changeViceCaptain,
  resetPlayingTeam,
  showError,
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const [selectedStarting, setSelectedStarting] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  //   let selectedStarting = -1;
  //   let selectedSub = -1;
  useEffect(() => {
    if (userProfile === null) {
      return;
    }
    loadGWTeam(userProfile);
    console.log(typeof newCaptain);
  }, [userProfile]);

  useEffect(() => {
    if (selectedStarting != null) {
      if (selectedSub != null) {
        if (
          selectedStarting.ELEMENT_TYPE == "GK" &&
          selectedSub.ELEMENT_TYPE != "GK"
        ) {
          //console.log("You can not replace a GK with a outfield player");
          showError("You can not replace a GK with a outfield player");
          setSelectedStarting(null);
        } else if (
          selectedSub.ELEMENT_TYPE == "GK" &&
          selectedStarting.ELEMENT_TYPE != "GK"
        ) {
          showError("You can not replace a GK with a outfield player");
          setSelectedStarting(null);
        } else {
          if (newCaptain == selectedStarting.PLAYER_ID) {
            changeCaptain(selectedSub.PLAYER_ID);
            console.log(newCaptain);
          } else if (newViceCaptain == selectedStarting.PLAYER_ID) {
            changeViceCaptain(selectedSub.PLAYER_ID);
            console.log(newViceCaptain);
          }

          const tempPlayingTeam = new Array();
          var flag = false;
          newPlayingTeam.forEach((player) => {
            if (
              player.ELEMENT_TYPE === selectedSub.ELEMENT_TYPE &&
              flag === false
            ) {
              tempPlayingTeam.push(selectedSub);
              flag = true;
            }
            if (player != selectedStarting) {
              tempPlayingTeam.push(player);
            }
          });
          if (flag === false) {
            tempPlayingTeam.push(selectedSub);
            flag = true;
          }

          console.log(tempPlayingTeam);
          console.log(newSubs);
          const tempSubs = new Array();
          flag = false;
          // var count = 0;
          newSubs.forEach((player) => {
            console.log(player);
            if (
              player.ELEMENT_TYPE === selectedStarting.ELEMENT_TYPE &&
              flag === false
            ) {
              tempSubs.push(selectedStarting);
              flag = true;
            }
            if (player != selectedSub) {
              tempSubs.push(player);
            }
          });
          if (flag === false) {
            tempSubs.push(selectedStarting);
            flag = true;
          }
          console.log(newSubs.size);
          console.log(tempSubs);

          changePlayingTeam(tempPlayingTeam, tempSubs);
          showError(
            "Player In: " +
              selectedSub.FULLNAME +
              "\n" +
              "Player Out: " +
              selectedStarting.FULLNAME
          );
          setSelectedStarting(null);
          setSelectedSub(null);
        }
      }
    }
  }, [selectedStarting, selectedSub]);

  // if (confirmed) {
  //   return <Navigate to="/" />;
  // }
  const playingTeamHandler = (e, player) => {
    if (selectedStarting == null) {
      setSelectedStarting(player);
    } else {
      setSelectedStarting(null);
    }
  };

  const subHandler = (e, player) => {
    if (selectedSub == null) {
      setSelectedSub(player);
    } else {
      setSelectedSub(null);
    }
  };

  const resetPlayingEleven = (e) => {
    resetPlayingTeam();
  };

  const confirmPlayingEleven = (e) => {
    confirmPlayingTeam(
      userProfile.USER_ID,
      newPlayingTeam,
      newSubs,
      newCaptain,
      newViceCaptain
    );

    window.location.reload(false);
  };

  return (
    <div>
      {userProfile === null ? (
        <></>
      ) : (
        <div class="container">
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col" style={{ width: "10%" }}></th>
                <th scope="col">Player</th>
                <th scope="col">Club</th>
                <th scope="col">Position</th>
                <th scope="col">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {newPlayingTeam === null ? (
                <></>
              ) : (
                newPlayingTeam.map((player) => {
                  return (
                    <PlayerModal
                      selected={selectedStarting}
                      onSwitch={playingTeamHandler}
                      player={player}
                    />
                    // <tr
                    //   style={
                    //     selectedStarting === player
                    //       ? { background: "#e63900" }
                    //       : { background: "white" }
                    //   }
                    // >
                    //   <td>
                    //     <button className="playerButton">
                    //       {player.PLAYER_ID == newCaptain
                    //         ? player.FULLNAME + " (C)"
                    //         : player.PLAYER_ID == newViceCaptain
                    //         ? player.FULLNAME + " (VC)"
                    //         : player.FULLNAME}
                    //     </button>
                    //   </td>
                    //   <td>{player.TEAM}</td>
                    //   <td>{player.ELEMENT_TYPE}</td>
                    //   <td>{player.TOTAL_POINTS}</td>
                    //   <td>
                    //     <PlayerModal
                    //       onSwitch={playingTeamHandler}
                    //       player={player}
                    //     />
                    //   </td>
                    // </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col" style={{ width: "10%" }}></th>
                <th scope="col">Player</th>
                <th scope="col">Club</th>
                <th scope="col">Position</th>
                <th scope="col">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {newSubs === null ? (
                <></>
              ) : (
                newSubs.map((player, index) => {
                  return (
                    <PlayerModal
                      selected={selectedSub}
                      onSwitch={subHandler}
                      player={player}
                      sub={true}
                    />
                    // <tr
                    //   style={
                    //     selectedSub === player
                    //       ? { background: "#2eb82e" }
                    //       : { background: "white" }
                    //   }
                    // >
                    //   <td>{player.FULLNAME}</td>
                    //   <td>{player.TEAM}</td>
                    //   <td>{player.ELEMENT_TYPE}</td>
                    //   <td>{player.TOTAL_POINTS}</td>
                    //   <td>
                    //     <PlayerModal onSwitch={subHandler} player={player} />
                    //   </td>
                    // </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {/* <PlayerModal show={showPlayerModal} /> */}

          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={(e) => resetPlayingEleven(e)}
          >
            Reset
          </button>

          <button
            type="button"
            className="btn btn-primary mt-3 ml-3"
            onClick={(e) => confirmPlayingEleven(e)}
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  playingTeam: state.gameweek.playingTeam,
  newPlayingTeam: state.gameweek.newPlayingTeam,
  subs: state.gameweek.subs,
  newSubs: state.gameweek.newSubs,
  captain: state.gameweek.captain,
  newCaptain: state.gameweek.newCaptain,
  viceCaptain: state.gameweek.viceCaptain,
  newViceCaptain: state.gameweek.newViceCaptain,
});

export default connect(mapStateToProps, {
  loadGWTeam,
  changePlayingTeam,
  changeCaptain,
  changeViceCaptain,
  resetPlayingTeam,
  confirmPlayingTeam,
  showError,
})(PlayingTeam);
