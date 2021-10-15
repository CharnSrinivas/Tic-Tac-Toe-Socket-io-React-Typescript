import { BoardInitialState } from "./initialStates";
import * as actionTypes from '../actions/actonTypes'
export default function boardReducer(state=BoardInitialState(),action:{type:string,payload:any})
{
    switch (action.type){
        case actionTypes.CHANGE_PLAYER:
            return Object.assign({},state,{player:action.payload.player});
        case actionTypes.CHANGE_CURRENT_PLAYER:
            return Object.assign({},state,{current_player:action.payload.current_player})
        case actionTypes.CHANGE_IS_PLAYING:
            return Object.assign({},state,{is_playing:action.payload.is_playing})
        case actionTypes.UPDATE_SCORES:
            return Object.assign({},state,{scores:action.payload.scores})
        case actionTypes.UPDATE_BOARD:
            return Object.assign({},state,{board:action.payload.board});
        default:
            return state;
    }
}