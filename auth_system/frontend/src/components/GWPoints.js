import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import "./Component.css";

const GWPoints = ({
  userProfile,
}) => {


  const [starters, setStarters] = useState(null);
  const [subs, setSubs] = useState(null);
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [gameweek, setGameweek] = useState([]);
  const [points, setPoints] = useState([]);
  useEffect(() => {
    if (userProfile === null) {
      return;
    }

    const req = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/points/${userProfile.USER_ID}/`,
          config
        );
        console.log(res.data)
        const Gameweek = res.data.gameweek
        const Starters = res.data.starter_points;
        const Subs = res.data.subs_points;
        const Captain = res.data.captain;
        const ViceCaptain = res.data.vice_captain;
        const Points = res.data.gw_points;
        setGameweek(Gameweek);
        setStarters(Starters);
        setSubs(Subs);
        setCaptain(Captain);
        setViceCaptain(ViceCaptain);
        setPoints(Points);
        console.log(starters);
        console.log(captain);
        
      } catch (err) {
          console.log(err);
      }
   };
   req();

  }, [userProfile]);


  return (
    <div>
      {userProfile === null ? (
        <></>
      ) : (
        <div class="container" >
          <table className="table">
            <thead className="thead-dark">
              <tr>
                  <th colspan="7" style={{textAlign:"left"}}>GAMEWEEK {gameweek}</th>
                  <th colspan="7" style={{textAlign:"right"}}>POINTS {points}</th>
              </tr>
            </thead>
             <tr>
                <th scope="col">Starters</th>
                <th scope="col">Club</th>
                <th scope="col">POS</th>
                <th scope="col">PTS</th>
                <th scope="col">MatP</th>
                <th scope="col">MinP</th>
                <th scope="col">GS</th>
                <th scope="col">A</th>
                <th scope="col">CS</th>
                <th scope="col">PS</th>
                <th scope="col">PM</th>
                <th scope="col">YC</th>
                <th scope="col">RC</th>
                <th scope="col">B</th>
              </tr>
            <tbody>
              {starters === null ? (
                <></>
              ) : (
                starters.map((player) => {
                  return (
                    <tr>
                      <td width="140px">{player.NAME}</td>
                      <td>{player.TEAM}</td>
                      <td>{player.POSITION}</td>
                      <td>{player.POINTS}</td>
                      <td>{player.PLAYED}</td>
                      <td>{player.MINUTES}</td>
                      <td>{player.GOALS}</td>
                      <td>{player.ASSISTS}</td>
                      <td>{player.CS}</td>
                      <td>{player.PENALTIES_SAVED}</td>
                      <td>{player.PENALTIES_MISSED}</td>
                      <td>{player.YELLOW}</td>
                      <td>{player.RED}</td>
                      <td>{player.BONUS}</td>
                   </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Substitutes</th>
                <th scope="col">Club</th>
                <th scope="col">POS</th>
                <th scope="col">PTS</th>
                <th scope="col">MatP</th>
                <th scope="col">MinP</th>
                <th scope="col">GS</th>
                <th scope="col">A</th>
                <th scope="col">CS</th>
                <th scope="col">PS</th>
                <th scope="col">PM</th>
                <th scope="col">YC</th>
                <th scope="col">RC</th>
                <th scope="col">B</th>
              </tr>
             
            </thead>

            <tbody>
              {subs === null ? (
                <></>
              ) : (
                subs.map((player) => {
                  return (
                    <tr >
                      <td width="140px">{player.NAME}</td>
                      <td>{player.TEAM}</td>
                      <td>{player.POSITION}</td>
                      <td>{player.POINTS}</td>
                      <td>{player.PLAYED}</td>
                      <td>{player.MINUTES}</td>
                      <td>{player.GOALS}</td>
                      <td>{player.ASSISTS}</td>
                      <td>{player.CS}</td>
                      <td>{player.PENALTIES_SAVED}</td>
                      <td>{player.PENALTIES_MISSED}</td>
                      <td>{player.YELLOW}</td>
                      <td>{player.RED}</td>
                      <td>{player.BONUS}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


export default GWPoints

