import React from "react";
import { Fragment } from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const PlayerSelection = () => {
  const [searchData, setSearchData] = useState();
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
                <th scope="col">Price</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((player) => {
                return (
                  <tr>
                    <th scope="row" style={{ width: "70%" }}>
                      {player.FULLNAME}
                    </th>
                    <td style={{ width: "20%" }}>{player.NOW_COST}</td>
                    <td style={{ width: "10%" }}>
                      <button type="button" className="btn btn-primary">
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

export default PlayerSelection;
