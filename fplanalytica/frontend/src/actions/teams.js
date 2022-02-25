import { TEAMS_LOADED } from "./types";
import axios from "axios";

export const loadTeams = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/teams/all/`,
      config
    );

    console.log(res.data);

    dispatch({
      type: TEAMS_LOADED,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const loadPlayers = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/players/all/`,
      config
    );

    dispatch({
      type: TEAMS_LOADED,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};
