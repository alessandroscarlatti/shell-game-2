import React from "react";
import ReactDOM from "react-dom";
import GameArea from "./GameArea";
import { createStore, applyMiddleware, compose } from "redux";
import { gameAreaReducer } from "./GameArea";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

import "./styles.css";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  gameAreaReducer,
  composeEnhancers(applyMiddleware(thunk, createLogger()))
);

function App() {
  // create the game

  return (
    <Provider store={store}>
      <div>
        <h1>Shell Game</h1>
        <GameArea />
      </div>
    </Provider>
  );
}

function render() {
  ReactDOM.render(<App />, document.getElementById("root"));
}

store.subscribe(render);
render();
