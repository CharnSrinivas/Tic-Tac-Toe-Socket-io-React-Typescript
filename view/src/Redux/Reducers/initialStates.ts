import { player } from "../../gameModels"
import { getSavedGameState } from "../../Utils/Utils"
export const BoardInitialState = ():BoardStateModel => {
    let saved_game_state = getSavedGameState();
    if(saved_game_state){
        return saved_game_state.board
    }
    return {
    player:1,
    board:[-1,-1,-1,-1,-1,-1,-1,-1,-1],
    current_player:1,
    scores:{"1":0,"0":0},
    is_playing:false,
    opponent_joined:false,
    winner:-1
    }
}
export interface BoardStateModel{
    player:1|0;
    board:player[];
    current_player:player;
    scores:{'1':number,'0':number};
    is_playing:boolean;
    opponent_joined:boolean;
    winner:player;
}

export const GameInitialState =() :GameStateModel=>{
    let saved_game_state = getSavedGameState();
    if(saved_game_state){
        return saved_game_state.game
    }
    return{
        game_id:null
    }
}

export interface GameStateModel
{
    game_id:string|null;
}

export interface stateModel{
    board:BoardStateModel;
    game:GameStateModel;
}