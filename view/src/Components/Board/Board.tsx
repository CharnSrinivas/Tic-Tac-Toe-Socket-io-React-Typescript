import React from 'react';
import styles from './styles.module.css';
import { stateModel } from '../../Redux/Reducers/initialStates';
import { Dispatch } from 'redux';
import { server_socket_url } from '../../config'
import { update_board, set_winner, change_player, change_current_player, update_scores, change_is_playing, update_opponent_join } from '../../Redux/actions/boardActions';
import SocketService from '../../Utils/Services/Socket/SocketService';
import { connect } from 'react-redux';
import { Board as board, player } from '../../gameModels';
import { ReactComponent as XIcon } from '../../assets/player-icons/x.svg';
import { ReactComponent as OIcon } from '../../assets/player-icons/o.svg';
import { checkBoard } from '../../Utils/Utils';
import Popup from '../Popup'

export interface IBoardProps {
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

export interface IBoardState {
  close_game: boolean
}

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
      SocketService.makeMove(props.player, props.index, props.game_id);
    }
  }
  let can_click = props.is_playing && props.board[props.index] === -1 ? true : false;


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

class Board extends React.Component<IBoardProps, IBoardState> {
  constructor(props: any) {

    super(props);
    this.state = {
      close_game: false
    }
    console.log(server_socket_url)
    SocketService.connect(server_socket_url).then(() => {
      SocketService.joinRoom(this.props.game_id).then(() => {
        this.props.change_is_playing(true);
        SocketService.listenForOpponentJoining().then(({ room_id, opp_socket_id }: any) => {
          console.log("Opponent joined " + room_id + "  " + opp_socket_id);
          this.props.update_opponent_join(true);
        })
        this.listenForMove();
      })
    })
    window.history.pushState(null, "", window.location.href);
    // ? Stopping user to go back;\
    window.addEventListener('popstate',this.listenForBackBtn,true)
  }
  listenForBackBtn = ()=>{
    window.history.pushState(null, "", window.location.href);
    this.setState({ close_game: true });
  }
  changePlayer=()=> {
    let cur_player = this.props.current_player;
    if (cur_player === 1) this.props.change_current_player(0);
    else if (cur_player === 0) this.props.change_current_player(1);
  }
  listenForMove=()=> {
    SocketService.listenForMove().then(({ player, pos, room_id }) => {
      console.log(player, pos, room_id);
      let new_board = this.props.board;
      new_board[pos] = player;
      this.props.update_board(new_board);
      this.changePlayer();
      this.listenForMove();
    }).catch(e => { console.log(e); this.props.update_opponent_join(false); })
  }

  componentDidUpdate=()=> {
    console.log(this.props);
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

  get_winner_banner=()=> {
    if (this.props.winner === -1) return null;
    if (this.props.winner === this.props.player) {
      return (
        <div className={styles['winner-banner-container']}>
          <div className={styles['winner-banner-wrapper']}>
            <h1>You won.</h1>
          </div>
        </div>

      )
    } else {
      return (
        <div className={styles['winner-banner-container']}>
          <div className={styles['winner-banner-wrapper']}>

            <h1>You loose.</h1>
          </div>
        </div>

      )
    }
  }

  onGameExit=()=>{
    SocketService.close_game(this.props.game_id,this.props.player).finally(()=>{
      window.removeEventListener('popstate',this.listenForBackBtn,true); 
      window.history.back();     
    })
    
  }
  closeGamePopup() {
    if (!this.state.close_game) return null;
    return (
      <Popup
        content={
          <div className={styles['close-game-container']}>
            <h2>Are you sure to exit the game.</h2>
            <div className={styles['btn-container']}>
              <div className={styles['positive-btn']}
               onClick={this.onGameExit}>Exit
               </div>
              <div className={styles['negative-btn']} onClick={() => { this.setState({ close_game: false }) }}>Cancel</div>
            </div>
          </div>}
        onExit={() => { this.setState({ close_game: false }) }} />
    )
  }
  displaYTurn=()=>{
    if(this.props.current_player === this.props.player && this.props.is_playing){
      return(<div className={styles['display-turn-container']}>
        <h2>Yours turn.</h2>
      </div>)
    }
    else if(this.props.current_player !== this.props.player && this.props.is_playing){
      return(<div className={styles['display-turn-container']}>
        <h2>Opponent turn</h2>
      </div>)
    }else{
      return (<div className={styles['display-turn-container']}></div>)
    }
  }
  public render() {
    return (
      <div className={styles['container']}>

        {
          !this.props.opponent_joined
          &&
          <div className={styles['player-waiting-container']}>
            <div className={styles['player-waiting-wrapper']}>
              <h1>Opponent joining ...</h1>
              <h3>Game Id: {this.props.game_id}</h3>
            </div>
          </div>
        }
        {this.get_winner_banner()}
        {this.closeGamePopup()}
        {this.displaYTurn()}
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

}

export default connect(mapStateToProps, mapDispatchToProps)(Board);