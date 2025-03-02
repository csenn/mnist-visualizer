import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers";
import { thunk } from "redux-thunk";
import { enableBatching } from "redux-batched-actions";

const finalCreateStore = compose(applyMiddleware(thunk))(createStore);

export function configureStore(initialState) {
  return finalCreateStore(enableBatching(rootReducer), initialState);
}
