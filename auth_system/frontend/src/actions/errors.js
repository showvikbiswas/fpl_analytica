import { GET_ERRORS, SWITCH_ERROR_OFF } from "./types";

export const showError = (msg) => (dispatch) => {
  dispatch({
    type: GET_ERRORS,
    payload: msg,
  });
};

export const resetShow = () => (dispatch) => {
  dispatch({
    type: SWITCH_ERROR_OFF,
    payload: "dummy",
  });
};
