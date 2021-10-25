import store from "../Redux/store";
import { player } from "../gameModels";
const Board = 'board';
export function addToLocalStorage(board: player[]): player[] | null {
    let prev_board = localStorage.getItem(Board);
    localStorage.setItem(Board, JSON.stringify(board))
    if (prev_board) {
        return JSON.parse(prev_board);
    }
    return null;
}
export function getBoardFromLocalStorage(): player[] | null {
    if (localStorage.getItem(Board)) {
        return JSON.parse(localStorage.getItem(Board)!);
    }
    return null;
}

export function checkBoard(board: player[]) {
    let win_pos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
    for (let i = 0; i < win_pos.length; i++) {
        let same_pos = 0;
        let player = board[win_pos[i][0]]
        if (player !== -1) {
            for (let a = 1; a < win_pos[i].length; a++) {
                if (board[win_pos[i][a]] === player) { same_pos++; }
            }
        }
        if(same_pos >=2)return player;
    }
    return -1;
}

export function saveGameState(){
    let game_state = store.getState();
    localStorage.setItem('game-state',JSON.stringify(game_state));

}
export function getSavedGameState(){
    if(localStorage.getItem('game-state'))
        return JSON.parse(localStorage.getItem('game-state')!)   
    else
    return null;
}
