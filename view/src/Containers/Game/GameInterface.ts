import { player,Board as board } from "../../gameModels";
export interface GameProps {
    board: board;
    player: player;
    current_player: player;
    scores: { '1': number, '0': number }
    is_playing: boolean;
    update_board: Function;
    game_id: string;
    opponent_joined: boolean;
    winner: player;
    change_player: Function;
    change_current_player: Function;
    update_scores: Function;
    change_is_playing: Function;
    update_opponent_join: Function;
    set_winner: Function;
  }
  
  export interface GameState {
    close_game: boolean;opponent_exited?:boolean;
  }
  