import { combineReducers } from 'redux';
import board from './boardReducer';
import stateHistoryEnhancer from './stateHistoryEnhancer';

const rootReducer = combineReducers({
  board: stateHistoryEnhancer(board),
});

export default rootReducer;
