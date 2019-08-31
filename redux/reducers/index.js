import { combineReducers } from "redux";
import authReducer from "./authReducer";

export const rootReducer = combineReducers({
  authentication: authReducer
});
