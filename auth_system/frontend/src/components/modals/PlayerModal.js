import React from "react";
import { Fragment } from "react";

const PlayerModal = ({ selected, onSwitch, player }) => {
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
                <button className="btn btn-primary" data-bs-dismiss="modal">
                  Make Captain
                </button>
                <button className="btn btn-primary" data-bs-dismiss="modal">
                  Make Vice Captain
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
    </Fragment>
  );
};

export default PlayerModal;
