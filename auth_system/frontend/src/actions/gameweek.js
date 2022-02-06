import axios from "axios";
import {
  GW_TEAM_LOADED_SUCCESS,
  PLAYER_ADDED,
  PLAYER_REMOVED,
  RESET_TEAM,
  CONFIRM_TRANSFERS,
  GW_BUDGET_UPDATED,
  PLAYING_TEAM_CHANGED,
  SUBS_CHANGED,
  CAPTAIN_CHANGED,
  VICE_CAPTAIN_CHANGED,
  RESET_PLAYING_TEAM,
  RESET_SUBS,
  RESET_CAPTAIN,
  RESET_VICE_CAPTAIN,
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

    const team = res.data.team;
    const subs = res.data.subs;
    const captain = res.data.captain;
    const viceCaptain = res.data.vice_captain;
    const playingTeam = team.filter(
      (elem) => !subs.find(({ PLAYER_ID }) => elem.PLAYER_ID === PLAYER_ID)
    );

    console.log("team\n");
    console.log(team);
    console.log("playing team\n");
    console.log(playingTeam);
    console.log(subs);
    console.log(captain);
    console.log(viceCaptain);

    const id = userProfile.USER_ID;

    dispatch({
      type: GW_TEAM_LOADED_SUCCESS,
      payload: { team, playingTeam, subs, captain, viceCaptain },
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

export const resetGWTeam = (budget) => (dispatch) => {
  dispatch({
    type: RESET_TEAM,
    payload: "reset_team",
  });

  dispatch({
    type: GW_BUDGET_UPDATED,
    payload: budget,
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

export const changePlayingTeam =
  (changedPlayingTeam, changedSubs) => (dispatch) => {
    console.log("type" + typeof team);
    dispatch({
      type: PLAYING_TEAM_CHANGED,
      payload: changedPlayingTeam,
    });
    dispatch({
      type: SUBS_CHANGED,
      payload: changedSubs,
    });
  };

export const changeCaptain = (player_id) => (dispatch) => {
  // console.log("changeCaptain"+player_id)
  dispatch({
    type: CAPTAIN_CHANGED,
    payload: player_id,
  });
};

export const changeViceCaptain = (player_id) => (dispatch) => {
  dispatch({
    type: VICE_CAPTAIN_CHANGED,
    payload: player_id,
  });
};

export const resetPlayingTeam = () => (dispatch) => {
  dispatch({
    type: RESET_PLAYING_TEAM,
    payload: "reset_playing_team",
  });

  dispatch({
    type: RESET_SUBS,
    payload: "reset_subs",
  });

  dispatch({
    type: RESET_CAPTAIN,
    payload: "reset_captain",
  });

  dispatch({
    type: RESET_VICE_CAPTAIN,
    payload: "reset_vice_captain",
  });
};

export const confirmPlayingTeam =
  (id, playingTeam, subs, captain, viceCaptain) => async (dispatch) => {
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

    const teamData = new Array();
    playingTeam.forEach((player) => {
      teamData.push({ PLAYER_ID: player.PLAYER_ID, IS_STARTING: "Y" });
    });
    subs.forEach((player) => {
      teamData.push({ PLAYER_ID: player.PLAYER_ID, IS_STARTING: "N" });
    });
    const captainData = captain;
    const viceCaptainData = viceCaptain;
    console.log(captainData);
    console.log(viceCaptainData);
    // console.log(team);
    const body = JSON.stringify({ teamData, captainData, viceCaptainData });
    console.log(body);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/confirm_playing_team/${id}/`,
        body,
        config
      );

      const data = res.data;
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
