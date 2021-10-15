import * as actions from './actonTypes';
import { player } from '../../models';
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