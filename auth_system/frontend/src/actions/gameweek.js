import axios from "axios";
import { GW_TEAM_LOADED_SUCCESS, PLAYER_ADDED, PLAYER_REMOVED } from "./types";

export const loadGWTeam = (id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  console.log(id);

  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/current_gw_team/${id}/`,
      config
    );

    dispatch({
      type: GW_TEAM_LOADED_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const addPlayerToGWTeam = (player) => (dispatch) => {
  dispatch({
    type: PLAYER_ADDED,
    payload: player,
  });
};

export const removePlayerFromGWTeam = (player) => (dispatch) => {
  dispatch({
    type: PLAYER_REMOVED,
    payload: player,
  });
};

export const resetGWTeam = (dispatch) => {
  dispatch({
    type: RESET_TEAM,
    payload: "reset_team",
  });
};
