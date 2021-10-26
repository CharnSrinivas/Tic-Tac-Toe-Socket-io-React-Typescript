import * as actions from './actonTypes';
import { player } from '../../gameModels';
export function change_player(player: 1 | 0) {
    return {
        type: actions.CHANGE_PLAYER,
        payload: { player }
    }
}
export function update_board(board: [player]) {
    return {
        type: actions.UPDATE_BOARD,
        payload: {
            board: board
        }
    }
}
export function change_current_player(current_player: -1 | 1 | 0) {
    return {
        type: actions.CHANGE_CURRENT_PLAYER,
        payload: { current_player }
    }
}
export function update_scores(scores: { '1': number, '0': number }) {
    return {
        type: actions.UPDATE_SCORES,
        payload: { scores }
    }
}
export function change_is_playing(is_playing:boolean){
    return{type:actions.CHANGE_IS_PLAYING,payload:{is_playing}}
}
export function update_opponent_join(opponent_joined:boolean){
    return{type:actions.UPDATE_OPPONENT_JOIN,payload:{opponent_joined}}
}
export function set_winner(winner:player)
{
    return{type:actions.SET_WINNER,payload:{winner}}
}
// export function reset_board()
// {
    
//     return{type:actions.RESET_BOARD,payload:{board:BoardInitialState()}}
// }