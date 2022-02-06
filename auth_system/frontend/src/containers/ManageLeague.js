import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { loadUser } from "../actions/user";
import {
  editLeague,
  leaveLeague,
  changeLeagueAdmin,
  deleteUserLeague,
} from "../actions/leagues";
import { showError } from "../actions/errors";
import axios from "axios";
import ConfirmModal from "../components/modals/ConfirrmModal";

const ManageLeague = ({
  isAuthenticated,
  user,
  loadUser,
  userProfile,
  showError,
}) => {
  const { lid } = useParams();
  useEffect(() => {
    const getLeague = async (id) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/leagues/league/${id}/`,
          config
        );

        const data = res.data;
        setLeagueName(data.NAME);
        setLeague(data);
        setFormData({ name: data.NAME });
      } catch (err) {
        console.log(err);
      }
    };

    const getLeaguePlayers = async (id) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/leagues/players/${id}/`,
          config
        );

        const data = res.data;
        setLeaguePlayers(data);
      } catch (err) {
        console.log(err);
      }
    };

    getLeague(lid);
    getLeaguePlayers(lid);
  }, []);

  if (isAuthenticated && user !== null && userProfile == null) {
    loadUser(user.id);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    editLeague(lid, name);
    setLeagueChanged(true);
  };

  const removePlayer = async (e, player) => {
    console.log("Player will be removed inshallah");
    const res = await leaveLeague(player.USER_ID, lid);
    if (res === "delete success") {
      setLeaguePlayers(
        leaguePlayers.filter((currentPlayer) => {
          return player.USER_ID !== currentPlayer.USER_ID;
        })
      );
    }
    showError(res);
  };

  const [formData, setFormData] = useState({
    name: "",
  });
  const [leagueName, setLeagueName] = useState("");
  const [league, setLeague] = useState(null);
  const [leaguePlayers, setLeaguePlayers] = useState([]);
  const [leagueChanged, setLeagueChanged] = useState(false);

  const { name } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const changeAdmin = async (newManagerId, leagueId) => {
    const res = await changeLeagueAdmin(user.id, newManagerId, leagueId);
    if (res === "admin updated") {
      setLeagueChanged(true);
    }
  };

  const deleteLeague = async (id) => {
    const res = await deleteUserLeague(id);
    if (res === "league deleted") {
      setLeagueChanged(true);
    }
  };

  if (leagueChanged) {
    return <Navigate to="/leagues"></Navigate>;
  }

  return (
    <div>
      <div className="container mt-5">
        <h3>League Name</h3>
        <p>Maximum 30 characters</p>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-group mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="League Name"
              name="name"
              value={name}
              onChange={(e) => onChange(e)}
              required
              minLength="1"
              maxLength="30"
            ></input>
          </div>
          <button className="btn btn-primary mr-1" type="submit">
            Submit
          </button>
        </form>
        <p className="mt-3">
          Please think carefully before entering your league name. Leagues with
          names that are deemed inappropriate or offensive may result in your
          account being deleted.
        </p>
      </div>
      <div className="container mt-5">
        <h3>Manage Members</h3>
        <p className="mt-3">
          Members other than yourself are listed here. You can choose to remove
          members, or transfer ownership to another member.
        </p>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {user &&
              leaguePlayers
                .filter((player) => {
                  return player.USER_ID !== user.id;
                })
                .map((player) => {
                  return (
                    <tr>
                      <td>{player.NAME}</td>
                      <td style={{ width: "20%" }}>
                        <ConfirmModal
                          text="Set Admin"
                          title="Set Admin"
                          id={`leagueAdminChangeModal${player.USER_ID}`}
                          body={`Are you sure you want to set ${player.NAME} as the admin of this league? You will lose all admin privileges.`}
                          onConfirm={changeAdmin}
                          btnType={"warning"}
                          onConfirmParams={[player.USER_ID, league.ID]}
                        ></ConfirmModal>
                      </td>
                      <td style={{ width: "20%" }}>
                        <button
                          className="btn btn-danger"
                          onClick={(e) => removePlayer(e, player)}
                        >
                          Remove Player
                        </button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
        <h3 className="mt-3">Delete League</h3>
        <p className="mt-3">
          Warning! Clicking the button below will delete the league permanently.
          All corresponding data will be lost. Proceed with caution.
        </p>
        {league && (
          <ConfirmModal
            text={"Delete"}
            title="Delete League"
            id="deleteLeagueModal"
            body={`Are you sure you want to delete the league ${leagueName}?`}
            onConfirm={deleteLeague}
            btnType={"danger"}
            onConfirmParams={[league.ID]}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  userProfile: state.user.user,
});

export default connect(mapStateToProps, { loadUser, showError })(ManageLeague);
