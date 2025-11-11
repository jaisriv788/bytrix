import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slice/userDetails";
import showModalReducer from "./slice/modalSlice";

const rootReducer = combineReducers({
  user: userReducer,
  showModal: showModalReducer,
});

export default rootReducer;
