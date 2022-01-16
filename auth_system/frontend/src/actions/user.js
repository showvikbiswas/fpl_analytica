import { USER_LOADED, USER_PROFILE_COMPLETE, USER_FINALIZED } from "./types";
import axios from "axios";

export const loadUser = (email) => async (dispatch) => {
  const params = {
    email: email,
  };

  axios
    .get(`${process.env.REACT_APP_API_URL}/api/user/`, { params: params })
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const completeRegistration =
  (age, favclub, fplteam, email) => async (dispatch) => {
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

    const body = JSON.stringify({ age, favclub, fplteam, email });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/finalize/`,
        body,
        config
      );

      dispatch({
        type: USER_FINALIZED,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };
