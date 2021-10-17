import React from 'react';
import styles from './styles.module.css';
import { stateModel } from '../../Redux/Reducers/initialStates';
import { Dispatch } from 'redux';
// import { BoardStateModel } from '../../Redux/Reducers/initialStates';

import { server_socket_url } from '../../config'
import { update_board, change_player, change_current_player, update_scores, change_is_playing } from '../../Redux/actions/boardActions';
import SocketService from '../../Utils/Services/Socket/SocketService';
import { connect } from 'react-redux';
import { Board as board, player } from '../../gameModels';
import { ReactComponent as XIcon } from '../../assets/player-icons/x.svg';
import { ReactComponent as OIcon } from '../../assets/player-icons/o.svg';
import { checkBoard } from '../../Utils/Utils';


export interface IBoardProps {
  [x: string]: any;

  board: board;
  player: number;
  current_player: player;
  scores: { '1': number, '0': number }
  is_playing: boolean;
  update_board: Function;
  game_id: string;
  change_player: Function;
  change_current_player: Function;
  update_scores: Function;
  change_is_playing: Function;
}

const mapStateToProps = (state: stateModel) => {

  return {
    board: state.board.board,
    player: state.board.player,
    current_player: state.board.current_player,
    scores: state.board.scores,
    is_playing: state.board.is_playing,
    game_id: state.game.game_id
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    update_board: (board: [player]) => dispatch(update_board(board)),
    change_player: (player: 0 | 1) => dispatch(change_player(player)),
    change_current_player: (current_player: player) => dispatch(change_current_player(current_player)),
    update_scores: (scores: { '1': number, '0': number }) => dispatch(update_scores(scores)),
    change_is_playing: (is_playing: boolean) => dispatch(change_is_playing(is_playing))
  };
};




const BoardCell = connect(mapStateToProps, mapDispatchToProps)((props: any): JSX.Element => {

  const updateBoard = () => {

    let board = [...props.board];
    if (board[props.index] === -1 && props.is_playing && props.player === props.current_player) {

      board[props.index] = props.player;
      props.update_board(board);
      SocketService.makeMove(props.player, props.index, props.game_id);

    }

  }
  return (
    <div className={styles['cell']} onClick={updateBoard}>
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



class Board extends React.Component<IBoardProps> {
  constructor(props: any) {
    super(props);
    this.props.change_is_playing(true);
    SocketService.connect(server_socket_url).then(() => {
      SocketService.joinRoom(this.props.game_id).then(() => {
        this.listenForMove();

      })
    })
  }

  changePlayer() {
    let cur_player = this.props.current_player;
    if (cur_player === 1) this.props.change_current_player(0);
    else if (cur_player === 0) this.props.change_current_player(1);
  }

  listenForMove() {
    SocketService.listenForMove().then(({ player, pos, room_id }) => {
      console.log(player, pos, room_id);
      let new_board = this.props.board;
      new_board[pos] = player;
      this.props.update_board(new_board);

      this.changePlayer();
      this.listenForMove();
    }).catch(e => { console.log(e) })
  }

  componentDidUpdate() {
    console.log(this.props);
    const new_scores = this.props.scores;
    let board = this.props.board;
    switch (checkBoard(board)) {
      case 0:
        new_scores['0'] += 1; this.props.update_scores(new_scores);
        this.props.change_is_playing(false);
        break;
      case 1:
        new_scores['1'] += 1; this.props.update_scores(new_scores);
        this.props.change_is_playing(false);
        break;
    }
  }

  canplay(){
    if(this.props.is_playing){
      if(this.props.current_player === this.props.player){return 'true'}
    }
    return 'false';
  }
  public render() {

    return (
      <div className={styles['container']}>
        <div className={styles['board']} data-canplay={this.canplay()}>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);