import React from "react";
import { Fragment } from "react";
import { connect } from "react-redux";
import { changeCaptain } from "../../actions/gameweek";
import { changeViceCaptain } from "../../actions/gameweek";
import PlayerInfoModal from "./PlayerInfoModal";

const PlayerModal = ({
  selected,
  onSwitch,
  player,
  changeCaptain,
  changeViceCaptain,
  newCaptain,
  newViceCaptain,
  sub,
}) => {
  const captainOrVice = (id) => {
    if (player.PLAYER_ID === newCaptain) {
      return "C";
    } else if (player.PLAYER_ID === newViceCaptain) {
      return "V";
    } else {
      return "";
    }
  };

  return (
    <Fragment>
      <tr
        data-bs-toggle="modal"
        data-bs-target={`#subModal${player.PLAYER_ID}`}
        style={
          selected === player
            ? { background: "#2eb82e" }
            : { background: "white" }
        }
      >
        <td>{captainOrVice(player.PLAYER_ID)}</td>
        <td>{player.FULLNAME}</td>
        <td>{player.TEAM}</td>
        <td>{player.ELEMENT_TYPE}</td>
        <td>{player.TOTAL_POINTS}</td>
      </tr>
      {/* <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#subModal${player.PLAYER_ID}`}
      >
        Options
      </button>
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#subModal${player.PLAYER_ID}`}
      >
        Options
      </button> */}

      <div
        class="modal fade"
        id={`subModal${player.PLAYER_ID}`}
        tabindex="-1"
        aria-labelledby="subModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="subModalLabel">
                {player.FULLNAME}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="d-grid gap-2">
                <button
                  className="btn btn-primary"
                  onClick={(e) => onSwitch(e, player)}
                  data-bs-dismiss="modal"
                >
                  Switch
                </button>
                {!sub && (
                  <Fragment>
                    <button
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={(e) => changeCaptain(player.PLAYER_ID)}
                    >
                      Make Captain
                    </button>
                    <button
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={(e) => changeViceCaptain(player.PLAYER_ID)}
                    >
                      Make Vice Captain
                    </button>
                  </Fragment>
                )}
                <button
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  data-bs-toggle="modal"
                  data-bs-target={`#playerInfoModal${player.PLAYER_ID}`}
                >
                  View Information
                </button>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id={`playerInfoModal${player.PLAYER_ID}`}
        aria-hidden="true"
        aria-labelledby={`playerInfoModalLabel${player.PLAYER_ID}`}
        tabindex="-1"
      >
        <div class="modal-dialog modal-xl modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalToggleLabel2">
                Premier League
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <PlayerInfoModal player={player} />
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-primary"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
                data-bs-dismiss="modal"
              >
                Back to first
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  userProfile: state.user.user,
  team: state.gameweek.team,
  newTeam: state.gameweek.newTeam,
  newCaptain: state.gameweek.newCaptain,
  newViceCaptain: state.gameweek.newViceCaptain,
});

export default connect(mapStateToProps, { changeCaptain, changeViceCaptain })(
  PlayerModal
);
