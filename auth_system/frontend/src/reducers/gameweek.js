import {
  CONFIRM_TRANSFERS,
  GW_BUDGET_UPDATED,
  GW_TEAM_LOADED_SUCCESS,
  PLAYER_ADDED,
  PLAYER_REMOVED,
  RESET_TEAM,
} from "../actions/types";

const initialState = {
  team: null,
  newTeam: null,
  newBudget: 0,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GW_TEAM_LOADED_SUCCESS:
      return {
        ...state,
        team: payload,
        newTeam: payload,
      };
    case PLAYER_ADDED:
      return {
        ...state,
        newTeam: [...state.newTeam, payload],
      };
    case PLAYER_REMOVED:
      return {
        ...state,
        newTeam: state.newTeam.filter((player) => {
          return player.PLAYER_ID !== payload.PLAYER_ID;
        }),
      };
    case RESET_TEAM:
      return {
        ...state,
        newTeam: state.team,
      };

    case GW_BUDGET_UPDATED:
      return {
        ...state,
        newBudget: payload,
      };
    case CONFIRM_TRANSFERS:
    default:
      return state;
  }
}
