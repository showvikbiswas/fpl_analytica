import { combineReducers } from "redux";
import auth from "./auth";
import user from "./user";
import teams from "./teams";
import gameweek from "./gameweek";

export default combineReducers({
  auth,
  user,
  teams,
  gameweek,
});
