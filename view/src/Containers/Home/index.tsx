import React, { Component } from 'react';
import styles from './styles.module.css';
import Popup from '../../Components/Popup';
import { stateModel } from '../../Redux/Reducers/initialStates';
import { change_player, change_current_player } from '../../Redux/actions/boardActions';
import { saveGameState } from '../../Utils/Utils';
import { setGameId } from '../../Redux/actions/gameActions';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
interface Props {
    [x: string]: any
}
interface State {
    show_create_game_popup: boolean;
    show_join_game_popup: boolean
}

const mapStateToProps = (state: stateModel) => {
    return {
        board: state.board.board,
        current_player: state.board.player
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        change_player: (player: 1 | 0) => dispatch(change_player(player)),
        change_current_player: (current_player: 1 | -1 | 0) => dispatch(change_current_player(current_player)),
        setGameId: (game_id: string) => dispatch(setGameId(game_id))
    };
};


const CreateGamePopUp = connect(mapStateToProps, mapDispatchToProps)
    ((props: any) => {

        async function onCreate() {
            let input = document.getElementById('game-create-btn') as HTMLInputElement;
            let game_id = input.value;
            if (game_id && game_id.length > 2 && game_id.length < 5) {
                props.change_player(1);
                props.setGameId(game_id);
                // saveGameState();
                props.history.push('/game')

            }
        }
        return (
            <div>
                <h2>ENTER GAME ID</h2>
                <input type="number" id='game-create-btn' />
                <button onClick={onCreate}>create</button>
            </div>
        )
    }
    )
const JoinGamePopup = connect(mapStateToProps, mapDispatchToProps)
    ((props: any) => {
        function onJoin() {
            let input = document.getElementById('join-game-btn') as HTMLInputElement;
            let game_id = input.value;
            if (game_id && game_id.length > 2 && game_id.length < 5) {
                props.setGameId(game_id);
                props.change_player(0);
                // saveGameState();
                props.history.push('/game')
            }
        }
        return (
            <div>
                <h2>ENTER GAME ID</h2>
                <input type="number" id='join-game-btn' />
                <button onClick={onJoin}>Join</button>
            </div>
        )
    }
    )
export default class index extends Component<Props, State> {
    state = {
        show_create_game_popup: false,
        show_join_game_popup: false
    }
    render() {
        return (
            <div className={styles['home-container']}>
                <button onClick={() => { this.setState({ show_join_game_popup: false, show_create_game_popup: true }) }}>Create</button>
                <button onClick={() => { this.setState({ show_join_game_popup: true, show_create_game_popup: false }) }}>Join</button>

                {this.state.show_create_game_popup &&
                    <Popup
                        content={<CreateGamePopUp history={this.props.history} />}
                        onExit={() => { this.setState({ show_join_game_popup: false, show_create_game_popup: false }) }} />
                }
                {this.state.show_join_game_popup &&
                    <Popup
                        content={<JoinGamePopup history={this.props.history} />}
                        onExit={() => { this.setState({ show_join_game_popup: false, show_create_game_popup: false }) }} />
                }
            </div>
        )
    }
}
