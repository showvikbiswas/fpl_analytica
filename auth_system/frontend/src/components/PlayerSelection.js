import React from "react";
import { Fragment } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { addPlayerToGWTeam } from "../actions/gameweek";
import { showError } from "../actions/errors";

const PlayerSelection = ({
  team,
  addPlayerToGWTeam,
  newTeam,
  newBudget,
  showError,
}) => {
  // some constants
  const allowedGKs = 2;
  const allowedDEFs = 5;
  const allowedMIDs = 5;
  const allowedFWDs = 3;

  const [searchData, setSearchData] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [playerType, setPlayerType] = useState("GK");
  const [players, setPlayers] = useState([]);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  useEffect(() => {
    const getPlayers = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/players/`,
          config
        );
        setPlayers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getPlayers();
  }, []);

  const onSearchChange = (e) => {
    const searchWord = e.target.value;
    setSearchData(searchWord);
  };

  const onTypeChange = (e) => {
    const type = e.target.value;
    setPlayerType(type);
  };

  useEffect(() => {
    if (searchData === "") {
      // display all players of the selected type
      const newFilter = players.filter((player) => {
        return player.ELEMENT_TYPE === playerType;
      });

      setFilteredData(newFilter);
    } else {
      const newFilter = players
        .filter((player) => {
          return player.ELEMENT_TYPE === playerType;
        })
        .filter((player) => {
          return player.FULLNAME.toLowerCase().includes(
            searchData.toLowerCase()
          );
        });

      setFilteredData(newFilter);
    }
  }, [searchData, playerType]);

  const addPlayer = (e, player) => {
    if (newTeam.team.length == 15) {
      showError("The squad is already full");
      return;
    }

    // if (
    //   player ===
    //   newTeam.filter((teamPlayer) => {
    //     return teamPlayer.PLAYER_ID === player.PLAYER_ID;
    //   })[0]
    // ) {
    //   console.log(player.PLAYER_ID);
    //   console.log("Player already in squad");
    //   return;
    // }
    console.log(player);

    // check whether player can be added to the squad

    for (let i = 0; i < newTeam.team.length; i++) {
      if (newTeam.team[i].PLAYER_ID === player.PLAYER_ID) {
        showError(`${player.FULLNAME} is already added to the squad.`);
        return;
      }
    }

    var clubPlayers = 0;
    for (let i = 0; i < newTeam.team.length; i++) {
      if (newTeam.team[i].TEAM === player.TEAM) {
        clubPlayers++;
      }
    }

    if (clubPlayers === 3) {
      showError(
        `You have already selected the maximum number of players allowed from ${player.TEAM}`
      );
      return;
    }

    const elementType = player.ELEMENT_TYPE;
    var elementTypeExists = 0;
    for (let i = 0; i < newTeam.team.length; i++) {
      if (newTeam.team[i].ELEMENT_TYPE === player.ELEMENT_TYPE) {
        elementTypeExists++;
      }
    }

    if (player.ELEMENT_TYPE == "GK" && elementTypeExists === 2) {
      showError("You cannot add any more goalkeepers.");
      return;
    }

    if (player.ELEMENT_TYPE == "DEF" && elementTypeExists === 5) {
      showError("You cannot add any more defenders.");
      return;
    }

    if (player.ELEMENT_TYPE == "MID" && elementTypeExists === 5) {
      showError("You cannot add any more midfielders.");
      return;
    }

    if (player.ELEMENT_TYPE == "FWD" && elementTypeExists === 3) {
      showError("You cannot add any more forwards.");
      return;
    }

    // add player to the squad
    addPlayerToGWTeam(player, newBudget);
  };

  return (
    <Fragment>
      {/* <h2>Player Selection</h2>
      <h3>View</h3>
      <select
        class="form-select"
        aria-label="Default select example"
        onChange={(e) => onTypeChange(e)}
      >
        <option selected value="GK">
          Goalkeepers
        </option>
        <option value="DEF">Defenders</option>
        <option value="MID">Midfielders</option>
        <option value="FWD">Forwards</option>
      </select>

      <form class="form-inline my-2 my-lg-0">
        <input
          class="form-control mr-sm-2"
          placeholder="Search"
          aria-label="Search"
          value={searchData}
          onChange={(e) => onSearchChange(e)}
        />
      </form> */}

      <div>
        <h4>Player Selection</h4>
        <h5>View</h5>
        <select
          class="form-select"
          aria-label="Default select example"
          onChange={(e) => onTypeChange(e)}
        >
          <option selected value="GK">
            Goalkeepers
          </option>
          <option value="DEF">Defenders</option>
          <option value="MID">Midfielders</option>
          <option value="FWD">Forwards</option>
        </select>
        <h5>Search</h5>
        <form class="form-inline my-2 my-lg-0">
          <input
            class="form-control mr-sm-2"
            placeholder="Search"
            aria-label="Search"
            value={searchData}
            onChange={(e) => onSearchChange(e)}
          />
        </form>
        <div>
          <h4>{filteredData.length} players shown</h4>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Player </th>
                <th scope="col">Club </th>
                <th scope="col">Price</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((player) => {
                return (
                  <tr>
                    <th scope="row" style={{ width: "50%" }}>
                      {player.FULLNAME}
                    </th>
                    <th scope="row" style={{ width: "20%" }}>
                      {player.TEAM}
                    </th>
                    <td style={{ width: "20%" }}>{player.NOW_COST}</td>
                    <td style={{ width: "10%" }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={(e) => addPlayer(e, player)}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  team: state.gameweek.team,
  newTeam: state.gameweek.newTeam,
  newBudget: state.gameweek.newBudget,
});

export default connect(mapStateToProps, { addPlayerToGWTeam, showError })(
  PlayerSelection
);
