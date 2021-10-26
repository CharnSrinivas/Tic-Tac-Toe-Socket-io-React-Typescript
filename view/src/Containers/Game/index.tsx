import React from 'react';
import styles from './styles.module.css';
import { server_socket_url } from '../../config';
import { stateModel } from '../../Redux/Reducers/initialStates';
import { Dispatch } from 'redux';
import { update_board, set_winner, change_player, change_current_player, update_scores, change_is_playing, update_opponent_join } from '../../Redux/actions/boardActions';
import { connect } from 'react-redux';
import { player } from '../../gameModels';
import Popup from '../../Components/Popup'
import { GameProps, GameState } from './GameInterface';
import Board from './Board';
import SocketService from '../../Utils/Services/Socket/SocketService';
import { ReactComponent as BackArrowIco } from '../../assets/icons/back_arrow.svg';
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

class Game extends React.Component<GameProps, GameState>{

  constructor(props: any) {
    super(props);
    this.state = { close_game: false, opponent_exited: false }
    // ?⛔🔙 Stopping user to go back;

    window.history.pushState(null, "", window.location.href);
    window.addEventListener('popstate', this.listenForBackBtn);

    SocketService.connect(server_socket_url).then(() => {
      SocketService.joinRoom(this.props.game_id).then(() => {
        this.listenForPlayerExit();
        this.props.change_is_playing(true);
        SocketService.listenForOpponentJoining().then(({ room_id, opp_socket_id }: any) => {
          console.log("Opponent joined " + room_id + "  " + opp_socket_id);
          GameAudio.game_sounds.player_join?.play();
          this.props.update_opponent_join(true);
        })
        this.listenForMove();
      })
    })

  }
  // ? --------- 📢🦻🦻 Game event listeners ------------------
  listenForBackBtn = () => {
    this.setState({ close_game: true });
    console.log('back btn');

    window.history.pushState(null, "", window.location.href);
  }

  listenForMove = () => {
    SocketService.listenForMove().then(({ player, pos, room_id }) => {
      console.log(player, pos, room_id);
      let new_board = this.props.board;
      new_board[pos] = player;
      GameAudio.game_sounds.move?.play();
      this.props.update_board(new_board);
      this.changePlayer();
      this.listenForMove();
    }).catch(e => { console.log(e); this.props.update_opponent_join(false); })
  }

  onGameExit = () => {

    window.removeEventListener('popstate', this.listenForBackBtn);
    SocketService.close_game(this.props.game_id, this.props.player)
      .finally(() => {
        console.log("close game")
        if (process.env.PUBLIC_URL) { window.location.href = process.env.PUBLIC_URL; }

        else { console.log("onexit"); window.history.back(); window.history.back(); }
      })
      .catch((e) => { console.log(e + "close game error") })
  }
  listenForPlayerExit = () => {
    SocketService.listenForOpponentExit().then(() => {
      console.log('exited');
      this.setState({opponent_exited:true})
    })
      .catch((err) => {
        console.log(err);
      })
  }
  //?---------------------------------------------
  changePlayer = () => {
    let cur_player = this.props.current_player;
    if (cur_player === 1) this.props.change_current_player(0);
    else if (cur_player === 0) this.props.change_current_player(1);
  }
  //? -----------------------------------  Game components   -------------------------------------
  displayTurn = () => {
    if (this.props.current_player === this.props.player && this.props.is_playing) {
      return (<div className={styles['display-turn-container']}>
        <h2>Yours turn.</h2>
      </div>)
    }
    else if (this.props.current_player !== this.props.player && this.props.is_playing) {
      return (<div className={styles['display-turn-container']}>
        <h2>Opponent turn</h2>
      </div>)
    } else {
      return (<div className={styles['display-turn-container']}></div>)
    }
  }
  playerExit = () => {
    if (this.state.opponent_exited) {
      return (
        <div className={styles['winner-banner-container']}>
          <div className={styles['winner-banner-wrapper']}>
            <h1>Opponent exited</h1>
          </div>
        </div>
      )
    }
  }
  get_winner_banner = () => {
    if (this.props.winner === -1) return null;
    return (
      <div className={styles['winner-banner-container']}>
        <div className={styles['winner-banner-wrapper']}>
          {this.props.winner === this.props.player ? <h1>You Won.</h1> : <h1>You Loose.</h1>}
        </div>
      </div>
    )
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
                onClick={this.onGameExit}
              >
                Exit
              </div>
              <div className={styles['negative-btn']} onClick={() => { this.setState({ close_game: false }) }}>Cancel</div>
            </div>
          </div>}
        onExit={() => { this.setState({ close_game: false }) }} />
    )
  }
  back_btn = () => {
    return (
      <div className={styles['back-btn']} onClick={() => { this.setState({ close_game: true }) }}>
        <BackArrowIco />
      </div>)
  }
  //?---------------------------------------------------------------
  render() {

    return (
      <div className={styles['game-container']}>

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
        {this.displayTurn()}
        {this.playerExit()}
        {this.closeGamePopup()}
        {this.back_btn()}
        <Board />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
