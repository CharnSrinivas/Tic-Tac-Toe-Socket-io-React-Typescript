import React from 'react';
import styles from './styles.module.css';
import { stateModel } from '../../Redux/Reducers/initialStates';
import { Dispatch } from 'redux';
import SocketService from '../../Utils/Services/Socket/SocketService';
import { update_board, set_winner, change_player, change_current_player, update_scores, change_is_playing, update_opponent_join } from '../../Redux/actions/boardActions';
import { GameProps, GameState } from './GameInterfaces';
import { connect } from 'react-redux';
import { Board as board, player } from '../../gameModels';
import Popup from '../../Components/Popup'
import Board from './Board';

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


export default connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<GameProps, GameState> {
        constructor(props: any) {

            super(props);
            this.state = {
                close_game: false
            }
            window.history.pushState(null, "", window.location.href);
            // ? Stopping user to go back;\
            window.addEventListener('popstate', this.listenForBackBtn, true)

        }

        listenForBackBtn = () => {
            window.history.pushState(null, "", window.location.href);
            this.setState({ close_game: true });
        }

        get_winner_banner = () => {
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
        onGameExit = () => {
            SocketService.close_game(this.props.game_id, this.props.player).finally(() => {
                window.removeEventListener('popstate', this.listenForBackBtn, true);
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
                    {this.closeGamePopup()}
                    {this.displayTurn()}
                    <Board/>
                </div>
            )
        }
    }

)
