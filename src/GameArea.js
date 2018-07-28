import React from "react";
import PropTypes from "prop-types";
import Shell from "./Shell.jsx";
import "./styles.css";
import { connect } from "react-redux";
import { shellReducer } from "./Shell";

// state

const defaultGame = {
  winningIndex: Math.floor(Math.random() * 3),
  message: undefined,
  winsCount: 0,
  lossesCount: 0,
  gamesCount: 0,
  shells: [
    {
      index: 0,
      position: "DOWN"
    },
    {
      index: 1,
      position: "DOWN"
    },
    {
      index: 2,
      position: "DOWN"
    }
  ]
};

// reducer...

export function gameAreaReducer(state = defaultGame, action) {
  state = { ...state };
  let shells = [];
  state.shells.forEach(shell => {
    shells.push(shellReducer(shell, action));
  });

  if (action.type === "SHOW_MESSAGE") {
    state.message = {
      id: action.id,
      classes: action.classes,
      text: action.text
    };
  }

  if (action.type === "HIDE_MESSAGE") {
    state.message = null;
  }

  if (action.type === "SET_WINNING_SHELL") {
    state.winningIndex = action.index;
  }

  if (action.type === "WIN") {
    state.winsCount++;
    state.gamesCount++;
  }

  if (action.type === "LOSE") {
    state.lossesCount++;
    state.gamesCount++;
  }

  state.shells = shells;
  return state;
}

// behavior

function flipShellUpThenDown(dispatch) {
  return function(index) {
    return function(dispatch) {
      dispatch({
        type: "FLIP_SHELL",
        index
      });

      window.setTimeout(() => {
        dispatch({
          type: "FLIP_SHELL",
          index
        });
      }, 1000);
    };
  };
}

export function tryFlipShell(dispatch) {
  return function(index) {
    return function() {
      dispatch(flipShellUpThenDown(dispatch)(index));

      dispatch(function(dispatch, getState) {
        if (getState().winningIndex === index) {
          dispatch(youWin(dispatch)(index));
        } else {
          dispatch(youLose(dispatch)(index));
        }

        setWinningShell(dispatch)(Math.floor(Math.random() * 3))();
      });
    };
  };
}

let messageIdCounter = -1;
let messageTimers = [];

function youWin(dispatch) {
  return function(index) {
    return function(dispatch) {
      messageIdCounter++;

      dispatch({
        type: "WIN",
        index
      });

      messageTimers.forEach(timer => {
        window.clearTimeout(timer);
      });

      dispatch({
        type: "SHOW_MESSAGE",
        id: messageIdCounter,
        classes: ["WIN/LOSE", "WIN"],
        text: "You Win!"
      });

      let hideMessage = () => {
        dispatch({
          type: "HIDE_MESSAGE",
          id: messageIdCounter
        });
      };

      let timer = window.setTimeout(hideMessage, 1500);
      messageTimers.push(timer);
    };
  };
}

function youLose(dispatch) {
  return function(index) {
    return function(dispatch) {
      messageIdCounter++;

      dispatch({
        type: "LOSE",
        index
      });

      messageTimers.forEach(timer => {
        window.clearTimeout(timer);
      });

      dispatch({
        type: "SHOW_MESSAGE",
        id: messageIdCounter,
        classes: ["WIN/LOSE", "LOSE"],
        text: "You Lose!"
      });

      let hideMessage = () => {
        dispatch({
          type: "HIDE_MESSAGE",
          id: messageIdCounter
        });
      };

      let timer = window.setTimeout(hideMessage, 1500);
      messageTimers.push(timer);
    };
  };
}

export function setWinningShell(dispatch) {
  return function(index) {
    return function() {
      dispatch({
        type: "SET_WINNING_SHELL",
        index
      });
    };
  };
}

// display

class GameArea extends React.Component {
  constructor(props) {
    super(props);

    this.shells = this.shells.bind(this);
    this.Column = this.Column.bind(this);
  }

  shells() {
    let shells = [];

    for (let i = 0; i < this.props.shells.length; i++) {
      let shell = <Shell details={this.props.shells[i]} />;
      shells.push(shell);
    }
    return shells;
  }

  Column(shell, index) {
    return <td key={index}>{shell}</td>;
  }

  render() {
    let columns = [];

    this.shells().forEach((shell, index) => {
      columns.push(this.Column(shell, index));
    });

    return (
      <div className="gameArea">
        <table>
          <tbody>
            <tr>{columns}</tr>
          </tbody>
        </table>
        <div />
        <p>{this.props.message ? this.props.message.text : null}</p>
        <h2>Games</h2>
        <p>{this.props.stats.gamesCount}</p>
        <h2>Wins</h2>
        <p>{this.props.stats.winsCount}</p>
        <h2>Losses</h2>
        <p>{this.props.stats.lossesCount}</p>
      </div>
    );
  }
}

GameArea.propTypes = {
  shells: PropTypes.array
};

// associate state, behavior and display.

function mapStateToProps(state) {
  return {
    shells: state.shells,
    message: state.message,
    stats: {
      lossesCount: state.lossesCount,
      winsCount: state.winsCount,
      gamesCount: state.gamesCount
    }
  };
}

export default connect(mapStateToProps)(GameArea);
