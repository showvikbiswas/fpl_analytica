import { GET_ERRORS, SWITCH_ERROR_OFF } from "../actions/types";

const initialState = {
  msg: null,
  show: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_ERRORS:
      return {
        msg: payload,
        show: true,
      };
    case SWITCH_ERROR_OFF:
      return {
        ...state,
        show: false,
      };
    default:
      return state;
  }
}
