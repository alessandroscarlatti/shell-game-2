const defaultBoard = {
  shells: [
    {
      index: 0,
      state: "DOWN"
    },
    {
      index: 1,
      state: "DOWN"
    },
    {
      index: 2,
      state: "DOWN"
    }
  ]
};

export function boardReducer(state = defaultBoard, action) {
  switch (action.type) {
    default:
      return state;
  }
}
