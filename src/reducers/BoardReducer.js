import Lh from '../helpers/LaneHelper'

const boardReducer = (state = {lanes: []}, action) => {
  const {payload, type} = action;
  switch (type) {
    case 'LOAD_BOARD':
      return Lh.initialiseLanes(state, payload);
    case 'MOVE_CARD':
      console.log(123);
      return Lh.moveCardAcrossLanes(state, payload);
    case 'MOVE_LANE':
      return Lh.moveLane(state, payload);
    default:
      return state
  }
};

export default boardReducer
