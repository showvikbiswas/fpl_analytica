import React, { useState, useEffect } from "react";
import { loadUser } from "../actions/user";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";
import LeagueModal from "../components/modals/LeagueModal";
import { Link } from "react-router-dom";

const Leagues = ({ isAuthenticated, user, userProfile, loadUser }) => {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const getUserLeagues = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/leagues/user/${user.id}/`,
          config
        );
        setLeagues(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (user !== null) {
      getUserLeagues();
    }
  }, [user]);

  if (isAuthenticated && user !== null && userProfile == null) {
    loadUser(user.id);
  }

  return (
    <div className="container mt-5">
      {userProfile !== null ? (
        <h3>Leagues - {userProfile.TEAM_NAME}</h3>
      ) : (
        <></>
      )}
      <div class="d-flex flex-row bd-highlight mb-3">
        <div class="p-2 bd-highlight mr-3">
          <Link className="btn btn-primary" to="/leagues/create">
            <button className="btn btn-primary mr-3">Create League</button>
          </Link>
        </div>
        <div class="p-2 bd-highlight">
          <Link className="btn btn-primary" to="/leagues/join">
            <button className="btn btn-primary ml-3">Join League</button>
          </Link>
        </div>
      </div>

      {leagues.length === 0 ? (
        <p>You have no leagues to show</p>
      ) : (
        <table class="table">
          <thead>
            <tr>
              <th scope="col">League</th>
              <th scope="col">Rank</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {leagues.map((league) => {
              return (
                <tr>
                  <th scope="row">{league.NAME}</th>
                  <td>{league.RANK}</td>
                  <td style={{ width: "10%" }}>
                    <LeagueModal
                      text="Options"
                      leagueName={league.NAME}
                      admin={league.ADMIN}
                      id={league.ID}
                      leagues={leagues}
                      setLeagues={setLeagues}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  userProfile: state.user.user,
});

export default connect(mapStateToProps, { loadUser })(Leagues);
