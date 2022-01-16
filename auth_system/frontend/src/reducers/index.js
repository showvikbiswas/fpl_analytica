import { combineReducers } from "redux";
import auth from "./auth";
import user from "./user";
import teams from "./teams";

export default combineReducers({
  auth,
  user,
  teams,
});
