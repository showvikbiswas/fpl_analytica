import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Standings = () => {
  const { lid } = useParams();

  const [leagueName, setLeagueName] = useState("");
  const [leaguePlayers, setLeaguePlayers] = useState([]);

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
        data.sort((a, b) => {
          var pointsA = a.TOTAL_POINTS,
            pointsB = b.TOTAL_POINTS;
          return pointsB - pointsA;
        });
        setLeaguePlayers(data);
      } catch (err) {
        console.log(err);
      }
    };

    getLeague(lid);
    getLeaguePlayers(lid);
  }, []);

  useEffect(() => {}, [leaguePlayers]);

  var rank = 0;

  return (
    <div className="container mt-5">
      <h3>{leagueName}</h3>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Team and Manager</th>
            <th scope="col">GW</th>
            <th scope="col">TOT</th>
          </tr>
        </thead>
        <tbody>
          {leaguePlayers.map((player) => {
            rank++;
            return (
              <tr>
                <th scope="row">{rank}</th>
                <th>
                  <div class="d-flex flex-column bd-highlight">
                    <h5>{player.TEAM_NAME}</h5>
                    <p>{player.NAME}</p>
                  </div>
                </th>
                <th>{player.GW_POINTS}</th>
                <th>{player.TOTAL_POINTS}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Standings;
