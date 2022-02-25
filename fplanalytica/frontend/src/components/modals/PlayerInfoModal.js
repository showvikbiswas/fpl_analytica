import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";

const PlayerInfoModal = ({ player }) => {
  useEffect(() => {
    const getPlayerStats = async (id) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/stats/player/${id}/`,
          config
        );

        const data = res.data;
        setStats(data);
      } catch (err) {
        console.log(err);
      }
    };

    getPlayerStats(player.PLAYER_ID);
  }, []);

  const [stats, setStats] = useState(null);

  return (
    <Fragment>
      <h3>{player.FULLNAME}</h3>
      <h4>{player.ELEMENT_TYPE}</h4>
      <div className="container">
        <div className="d-flex justify-content-center"></div>
      </div>
      <h5>This Season</h5>

      <table class="table">
        <thead>
          <tr>
            <th>GW</th>
            <th>OPP</th>
            <th>PTS</th>
            <th>MP</th>
            <th>GS</th>
            <th>A</th>
            <th>CS</th>
            <th>GC</th>
            <th>OG</th>
            <th>PS</th>
            <th>PM</th>
            <th>YC</th>
            <th>RC</th>
            <th>S</th>
            <th>B</th>
          </tr>
        </thead>
        <tbody>
          {stats !== null ? (
            stats.map((stat) => {
              return (
                <tr>
                  <td>{stat.GW}</td>
                  <td>{stat.OPPONENT_TEAM}</td>
                  <td>{stat.TOTAL_POINTS}</td>
                  <td>{stat.MINUTES}</td>
                  <td>{stat.GOALS_SCORED}</td>
                  <td>{stat.ASSISTS}</td>
                  <td>{stat.CLEAN_SHEETS}</td>
                  <td>{stat.GOALS_CONCEDED}</td>
                  <td>{stat.OWN_GOALS}</td>
                  <td>{stat.PENALTIES_SAVED}</td>
                  <td>{stat.PENALTIES_MISSED}</td>
                  <td>{stat.YELLOW_CARD}</td>
                  <td>{stat.RED_CARDS}</td>
                  <td>{stat.SAVES}</td>
                  <td>{stat.BONUS}</td>
                </tr>
              );
            })
          ) : (
            <></>
          )}
        </tbody>
      </table>
    </Fragment>
  );
};

export default PlayerInfoModal;
