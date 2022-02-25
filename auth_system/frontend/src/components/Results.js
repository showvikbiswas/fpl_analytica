import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import gameweek from '../reducers/gameweek';
const Results = () => {
    const [results, setResults] = useState([]);
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
                `${process.env.REACT_APP_API_URL}/api/results/`,
                config
              );
              console.log(res.data)
              const Results = res.data.results;
              const Gameweek = res.data.gameweek;
              setResults(Results);
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
                  <td colspan="5" style={{textAlign:"center"}}>GAMEWEEK {gameweek}</td>
                </tr>
              </thead>
              <tbody>
                {results === null ? (
                  <></>
                ) : (
                  results.map((result) => {
                      return (
                        <tr>
                          <td style={{textAlign:"left", width:"35%"}}>{result.H_TEAM}</td>
                          <td style={{textAlign:"center", width:"10%"}}>{result.H_TEAM_SCORE}</td>
                          <td style={{textAlign:"center", width:"10%"}}> - </td>
                          <td style={{textAlign:"center", width:"10%"}}>{result.A_TEAM_SCORE}</td>
                          <td style={{textAlign:"right", width:"35%"}}>{result.A_TEAM}</td>
                        </tr> 
                      );          
                  })
                )}  
              </tbody>
            </table>
          </div>
        </div>);
};


export default Results;