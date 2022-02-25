import axios from "axios";
import { showError } from "./errors";
import { GET_ERRORS } from "./types";

export const createUserLeague = async (name, id) => {
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

  const body = JSON.stringify({ name, id });

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/leagues/create/`,
      body,
      config
    );

    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
};

export const joinUserLeague = (code, id) => async (dispatch) => {
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

  const body = JSON.stringify({ code, id });

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/leagues/join/`,
      body,
      config
    );

    const data = res.data;

    if (data === "already joined") {
      return data;
    } else if (data === "league not found") {
      return data;
    }
    console.log("League successfully joined.");
  } catch (err) {
    console.log(err);
  }
};

export const leaveLeague = async (pid, lid) => {
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

  try {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/leagues/${lid}/leave/${pid}/`,
      config
    );
    return "delete success";
  } catch (err) {
    console.log(err);
    return "delete failed";
  }
};

export const editLeague = async (id, leagueName) => {
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

  const body = JSON.stringify({ leagueName });

  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/leagues/edit/${id}/`,
      body,
      config
    );

    const data = res.data;
  } catch (err) {}
};

export const changeLeagueAdmin = async (oldAdminId, newAdminId, id) => {
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

  const body = JSON.stringify({ oldAdminId, newAdminId });

  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/leagues/edit/${id}/`,
      body,
      config
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteUserLeague = async (id) => {
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

  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/leagues/delete/${id}/`,
      config
    );

    return res.data;
  } catch (err) {
    console.log(err);
  }
};
