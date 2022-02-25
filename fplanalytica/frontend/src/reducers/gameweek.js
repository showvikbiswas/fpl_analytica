import {
  CONFIRM_TRANSFERS,
  GW_BUDGET_UPDATED,
  GW_TEAM_LOADED_SUCCESS,
  PLAYER_ADDED,
  PLAYER_REMOVED,
  PLAYING_TEAM_CHANGED,
  SUBS_CHANGED,
  CAPTAIN_CHANGED,
  VICE_CAPTAIN_CHANGED,
  RESET_TEAM,
  RESET_PLAYING_TEAM,
  RESET_SUBS,
  RESET_CAPTAIN,
  RESET_VICE_CAPTAIN,
  CONFIRM_PLAYING_TEAM,
} from "../actions/types";

const initialState = {
  team: null,
  newTeam: null,
  playingTeam: null,
  newPlayingTeam: null,
  subs: null,
  newSubs: null,
  captain: null,
  newCaptain: null,
  viceCaptain: null,
  newViceCaptain: null,
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
        playingTeam: payload.playingTeam,
        newPlayingTeam: payload.playingTeam,
        subs: payload.subs,
        newSubs: payload.subs,
        captain: payload.captain,
        newCaptain: payload.captain,
        viceCaptain: payload.viceCaptain,
        newViceCaptain: payload.viceCaptain,
      };
    case PLAYER_ADDED:
      return {
        ...state,
        newTeam: {
          ...state.newTeam,
          team: [...state.newTeam.team, payload],
        },
      };
    case PLAYER_REMOVED:
      return {
        ...state,
        newTeam: {
          ...state.newTeam,
          team: state.newTeam.team.filter((player) => {
            return player.PLAYER_ID !== payload.PLAYER_ID;
          }),
        },
      };
    case PLAYING_TEAM_CHANGED:
      return {
        ...state,
        newPlayingTeam: payload,
      };
    case SUBS_CHANGED:
      return {
        ...state,
        newSubs: payload,
      };
    case CAPTAIN_CHANGED:
      return {
        ...state,
        newCaptain: payload,
      };
    case VICE_CAPTAIN_CHANGED:
      return {
        ...state,
        newViceCaptain: payload,
      };
    case RESET_TEAM:
      return {
        ...state,
        newTeam: state.team,
      };

    case RESET_PLAYING_TEAM:
      return {
        ...state,
        newPlayingTeam: state.playingTeam,
      };
    case RESET_SUBS:
      return {
        ...state,
        newSubs: state.subs,
      };
    case RESET_CAPTAIN:
      return {
        ...state,
        newCaptain: state.captain,
      };
    case RESET_VICE_CAPTAIN:
      return {
        ...state,
        newTeam: state.viceCaptain,
      };
    case GW_BUDGET_UPDATED:
      return {
        ...state,
        newBudget: payload,
      };
    case CONFIRM_TRANSFERS:
    case CONFIRM_PLAYING_TEAM:
      return {
        ...state,
        newTeam: payload.team,
        newPlayingTeam: payload.playingTeam,
        newSubs: payload.subs,
        newCaptain: payload.captain,
        newViceCaptain: payload.viceCaptain,
      };
    default:
      return state;
  }
}
