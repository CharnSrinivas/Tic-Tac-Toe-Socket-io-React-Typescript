import { combineReducers } from "redux";
import boardReducer from "./boardReducer";
import gameReducer from "./gameReducer";
import * as I from './initialStates'
// import {UPDATE_FULL_STATE} from '../actions/actonTypes'
// export function fullStateAction(new_state:stateModel){
//     return{type:UPDATE_FULL_STATE,payload:{new_state}}
// }
console.log(I.BoardInitialState );

const rootReducer = combineReducers({ board: boardReducer, game: gameReducer });
export default rootReducer;