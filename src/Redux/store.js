import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
 
 
 
import carsReducer from "./Reducer/cardReducer";
 

const rootReducer = combineReducers({
 
  cars: carsReducer,
 
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
