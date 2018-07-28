import React from "react";
import "./styles.css";
import { connect } from "react-redux";
import { tryFlipShell, setWinningShell } from "./GameArea";

// behavior
const defaultState = {
  index: 0,
  position: "DOWN",
  win: false
};

export function shellReducer(state = defaultState, action) {
  switch (action.type) {
    case "FLIP_SHELL":
      if (action.index === state.index) {
        return {
          ...state,
          win: false,
          position: getNextPosition(state)
        };
      }
    case "WIN":
      if (action.index === state.index) {
        return {
          ...state,
          win: true
        };
      }
    default:
      return state;
  }
}

// flip shell action
export function flipShell(dispatch) {
  return function(index) {
    return function() {
      dispatch({
        type: "FLIP_SHELL",
        index
      });
    };
  };
}

function getNextPosition(shell) {
  if (shell.position === "UP") {
    return "DOWN";
  } else if (shell.position === "DOWN") {
    return "UP";
  } else {
    throw new Error(`Unrecognized shell position "${shell.position}"`);
  }
}

const shellClassNames = {
  UP: "shellUp",
  DOWN: "shellDown",
  WIN: "shellWin"
};

class Shell extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    let classNames = `shell ${shellClassNames[this.props.details.position]}`;
    if (this.props.details.position === "UP" && this.props.details.win) {
      classNames = `${classNames} ${shellClassNames.WIN}`;
    }
    return (
      <div
        className={classNames}
        onClick={this.props.tryFlipShell(this.props.details.index)}
      />
    );
  }
}

// associate state, behavior, and display

function mapDispatchToProps(dispatch) {
  return {
    tryFlipShell: tryFlipShell(dispatch),
    setWinningShell: setWinningShell(dispatch)
  };
}

export default connect(
  state => {
    return {};
  },
  mapDispatchToProps
)(Shell);
