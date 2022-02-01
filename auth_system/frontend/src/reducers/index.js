import { combineReducers } from "redux";
import auth from "./auth";
import user from "./user";
import teams from "./teams";
import gameweek from "./gameweek";
import errors from "./errors";

export default combineReducers({
  auth,
  user,
  teams,
  gameweek,
  errors,
});
