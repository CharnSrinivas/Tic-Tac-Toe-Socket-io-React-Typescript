import * as actions from './actonTypes';

export function setGameId(game_id:string){
    return{
        type:actions.SET_GAME_ID,payload:{game_id}
    }
}