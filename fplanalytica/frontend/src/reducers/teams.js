import { TEAMS_LOADED } from "../actions/types";

const initialState = {
  teams: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case TEAMS_LOADED:
      return {
        ...state,
        teams: payload,
      };
    default:
      return state;
  }
}
