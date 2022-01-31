import axios from "axios";
import {
  GW_TEAM_LOADED_SUCCESS,
  PLAYER_ADDED,
  PLAYER_REMOVED,
  RESET_TEAM,
  CONFIRM_TRANSFERS,
  GW_BUDGET_UPDATED,
} from "./types";

export const loadGWTeam = (userProfile) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/current_gw_team/${userProfile.USER_ID}/`,
      config
    );

    const team = res.data;
    const id = userProfile.USER_ID;

    dispatch({
      type: GW_TEAM_LOADED_SUCCESS,
      payload: team,
    });

    dispatch({
      type: GW_BUDGET_UPDATED,
      payload: userProfile.BUDGET,
    });
  } catch (err) {
    console.log(err);
  }
};

export const addPlayerToGWTeam = (player, newBudget) => (dispatch) => {
  dispatch({
    type: PLAYER_ADDED,
    payload: player,
  });

  dispatch({
    type: GW_BUDGET_UPDATED,
    payload: newBudget - player.NOW_COST,
  });
};

export const removePlayerFromGWTeam = (player, newBudget) => (dispatch) => {
  dispatch({
    type: PLAYER_REMOVED,
    payload: player,
  });

  dispatch({
    type: GW_BUDGET_UPDATED,
    payload: newBudget + player.NOW_COST,
  });
};

export const resetGWTeam = () => (dispatch) => {
  dispatch({
    type: RESET_TEAM,
    payload: "reset_team",
  });
};

export const confirmGWTransfers =
  (id, newBudget, newFreeTransfers, team, cost) => async (dispatch) => {
    function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }

    const csrftoken = getCookie("csrftoken");

    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    };
    // console.log(team);
    const body = JSON.stringify({ newBudget, newFreeTransfers, team, cost });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/confirm_gw_team/${id}/`,
        body,
        config
      );

      const data = res.data;

      dispatch({
        type: CONFIRM_TRANSFERS,
        payload: data,
      });
    } catch (err) {
      console.log(err);
    }
  };
