import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getLeague } from "../actions/leagues";

const InviteToLeague = () => {
  const { lid } = useParams();
  const [leagueName, setLeagueName] = useState("");
  const [leagueCode, setLeagueCode] = useState("");

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
        setLeagueCode(data.INVITE_CODE);
      } catch (err) {
        console.log(err);
      }
    };

    getLeague(lid);
  }, []);

  return (
    <div className="container mt-3 ml-3">
      <h3>Invite players to join {leagueName}</h3>
      <p>Code to join this league: {leagueCode}</p>
    </div>
  );
};

export default InviteToLeague;
