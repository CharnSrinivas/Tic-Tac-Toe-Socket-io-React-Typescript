import React from 'react';
import styles from './styles.module.css';
import { stateModel } from '../../Redux/Reducers/initialStates';
import { Dispatch } from 'redux';
import { update_board, set_winner, change_player, change_current_player, update_scores, change_is_playing, update_opponent_join } from '../../Redux/actions/boardActions';
import SocketService from '../../Utils/Services/Socket/SocketService';
import { connect } from 'react-redux';
import { player } from '../../gameModels';
import { ReactComponent as XIcon } from '../../assets/player-icons/x.svg';
import { ReactComponent as OIcon } from '../../assets/player-icons/o.svg';
import { checkBoard } from '../../Utils/Utils';
import { GameProps,GameState } from './GameInterface';
import GameAudio from '../../Utils/Services/Audio/AudioService';
const mapStateToProps = (state: stateModel) => {
    return {
      board: state.board.board,
      player: state.board.player,
      current_player: state.board.current_player,
      scores: state.board.scores,
      is_playing: state.board.is_playing,
      game_id: state.game.game_id,
      opponent_joined: state.board.opponent_joined,
      winner: state.board.winner
    };
  };
  const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
      update_board: (board: [player]) => dispatch(update_board(board)),
      change_player: (player: 0 | 1) => dispatch(change_player(player)),
      change_current_player: (current_player: player) => dispatch(change_current_player(current_player)),
      update_scores: (scores: { '1': number, '0': number }) => dispatch(update_scores(scores)),
      change_is_playing: (is_playing: boolean) => dispatch(change_is_playing(is_playing)),
      update_opponent_join: (is_joined: boolean) => dispatch(update_opponent_join(is_joined)),
      set_winner: (winner: player) => dispatch(set_winner(winner))
    };
  };
  
  const BoardCell = connect(mapStateToProps, mapDispatchToProps)((props: any): JSX.Element => {
    const updateBoard = () => {
      let board = [...props.board];
      if (board[props.index] === -1 && props.is_playing && props.player === props.current_player) {
        board[props.index] = props.player;
        props.update_board(board);
        GameAudio.game_sounds.move?.play();
        SocketService.makeMove(props.player, props.index, props.game_id);
      }
    }
    const can_click = props.is_playing && props.board[props.index] === -1 ? true : false;  
    return (
      <div className={styles['cell']} onClick={updateBoard} data-canclick={can_click}>
        {
          props.board[props.index] === 1 &&
          <XIcon />
        }
        {
          props.board[props.index] === 0 &&
          <OIcon />
        }
      </div>
    )
  })
  
  const Board = connect(mapStateToProps, mapDispatchToProps)
  (
  class extends React.Component<GameProps, GameState> {
    constructor(props: any) {
  
      super(props);
      this.state = {
        close_game: false
      }
      
    }

  
    componentDidUpdate = () => {
      const new_scores = this.props.scores;
      let board = this.props.board;
      switch (checkBoard(board)) {
        case 0:
          new_scores['0'] += 1; this.props.update_scores(new_scores);
          this.props.change_is_playing(false);
          this.props.set_winner(0);
          break;
        case 1:
          new_scores['1'] += 1; this.props.update_scores(new_scores);
          this.props.change_is_playing(false);
          this.props.set_winner(1);
          break;
      }
    }
  
    public render() {
      return (
        <div className={styles['board-container']}>
          <div className={styles['board']} >
            {
              this.props.board.length === 9 &&
              <>
                <div className={styles['column']}>
                  <div className={styles['row']}><BoardCell index={0} /></div>
                  <div className={styles['vr-line']}></div>
                  <div className={styles['row']}><BoardCell index={1} /></div>
                  <div className={styles['vr-line']}></div>
                  <div className={styles['row']}><BoardCell index={2} /></div>
                </div>
                <div className={styles['hr-line']}></div>
                <div className={styles['column']}>
                  <div className={styles['row']}><BoardCell index={3} /></div>
                  <div className={styles['vr-line']}></div>
                  <div className={styles['row']}><BoardCell index={4} /></div>
                  <div className={styles['vr-line']}></div>
                  <div className={styles['row']}><BoardCell index={5} /></div>
                </div>
                <div className={styles['hr-line']}></div>
                <div className={styles['column']}>
                  <div className={styles['row']}><BoardCell index={6} /></div>
                  <div className={styles['vr-line']}></div>
                  <div className={styles['row']}><BoardCell index={7} /></div>
                  <div className={styles['vr-line']}></div>
                  <div className={styles['row']}><BoardCell index={8} /></div>
                </div>
              </>
            }
          </div>
        </div>
      );
    }
  })
  
  export default Board;