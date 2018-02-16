import { combineReducers } from "redux";
import user from "./user";
import gifs from "./gifs";
import runtime from "./runtime";

export default combineReducers({
  gifs,
  user,
  runtime
});
