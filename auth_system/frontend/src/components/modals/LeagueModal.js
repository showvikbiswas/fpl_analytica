import React, { useState } from "react";
import { Fragment } from "react";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { leaveLeague } from "../../actions/leagues";
const Modal = ({ user, text, leagueName, admin, id, leagues, setLeagues }) => {
  const removePlayer = async (e, lid, pid) => {
    const res = await leaveLeague(pid, lid);
    if (res === "delete success") {
      setLeagues(
        leagues.filter((league) => {
          return league.id !== lid;
        })
      );
      window.location.reload(false);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#leagueModal${id}`}
      >
        {text}
      </button>
      <div
        class="modal fade"
        id={`leagueModal${id}`}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                {leagueName}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="container">
                <div className="row mt-2">
                  <div className="col">
                    <Link to={`/leagues/${id}/standings/`}>
                      <button
                        onClick={(e) => console.log(user.id)}
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Standings
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col">
                    <Link to={`/leagues/${id}/invite/`}>
                      <button
                        onClick={(e) => console.log(user.id)}
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Invite Friends
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col">
                    {user !== null ? (
                      admin === user.id && (
                        <Link to={`/leagues/${id}/manage/`}>
                          <button
                            onClick={(e) => console.log(user.id)}
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            Administer
                          </button>
                        </Link>
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col">
                    {user !== null ? (
                      admin !== user.id && (
                        <button
                          onClick={(e) => removePlayer(e, id, user.id)}
                          className="btn btn-danger"
                          data-bs-dismiss="modal"
                        >
                          Leave League
                        </button>
                      )
                    ) : (
                      <></>
                    )}
                  </div>
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
              </div>
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
});

export default connect(mapStateToProps, {})(Modal);
