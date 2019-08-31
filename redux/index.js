import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { rootReducer } from "./reducers";

export const initStore = (initialState = {}) => {
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
};
