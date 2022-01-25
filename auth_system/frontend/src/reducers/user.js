import {
  USER_LOADED,
  USER_PROFILE_COMPLETE,
  LOGOUT,
  USER_FINALIZED,
  USER_LOAD_FAIL,
} from "../actions/types";

const initialState = {
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        user: payload[0],
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
      };
    case USER_FINALIZED:
      return {
        ...state,
        user: payload[0],
      };
    case USER_LOAD_FAIL:
      return {
        ...state,
        user: "none",
      };
    default:
      return state;
  }
}
