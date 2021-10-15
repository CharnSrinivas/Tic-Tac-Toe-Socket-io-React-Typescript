import { GameStateModel ,GameInitialState} from "./initialStates";
import * as actions from '../actions/actonTypes'
export default function gameReducer(state=GameInitialState(),action:{type:string,payload:any})
{
    switch (action.type){
        case actions.SET_GAME_ID:
            return Object.assign({},state,{game_id:action.payload.game_id});
        default:
            return state
    }
}