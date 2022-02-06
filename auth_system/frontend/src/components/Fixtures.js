import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import gameweek from '../reducers/gameweek';
const Fixtures = () => {
    const [fixtures, setFixtures] = useState([]);
    const [gameweek, setGameweek] = useState([]);
    useEffect(() => {
         const req = async () => {
            const config = {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            };
            try {
              const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/fixtures/`,
                config
              );
              console.log(res.data)
              const Fixtures = res.data.fixtures;
              const Gameweek = res.data.gameweek;
              setFixtures(Fixtures);
              setGameweek(Gameweek);
            } catch (err) {
                console.log(err);
            }
         };
         req();
        
    }, []);
  return (
        <div>
          <div class="container">
            <table className="fixtureTable">
              <thead className="thead-dark">
                <tr>
                  <td></td>
                  <td style={{textAlign:"center"}}>GAMEWEEK {gameweek}</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {fixtures === null ? (
                  <></>
                ) : (
                  fixtures.map((fixture) => {
                      return (
                        <tr>
                          <td>{fixture.H_TEAM}</td>
                          <td style={{textAlign:"center"}}> - </td>
                          <td>{fixture.A_TEAM}</td>
                        </tr> 
                      );
                    
                  })
                )}  
              </tbody>
            </table>
          </div>
        </div>);
};


export default Fixtures;