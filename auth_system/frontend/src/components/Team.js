import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

const Team = ({ userProfile }) => {
  const [team, setTeam] = useState("");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  useEffect(() => {
    if (userProfile === null) {
      return;
    }

    const getCurrentTeam = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/current_gw_team/${userProfile.USER_ID}/`,
          config
        );
        // check whether res.data returns nothing
        if (res.data.length > 0) {
          setTeam(res.data[0].TEAM);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getCurrentTeam();
  }, [userProfile]);

  useEffect(() => {
    if (team !== "") {
    }
  }, [team]);
  return <div>{}</div>;
};

const mapStateToProps = (state) => ({
  userProfile: state.user.user,
});

export default Team;
