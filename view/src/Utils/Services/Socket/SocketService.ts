import { Socket, io } from 'socket.io-client';
import * as eveNames from './eventNames';
// import store from '../../../Redux/store'
class SocketService {
    socket: Socket | null = null;
    moveListeners:Function[] =[];

    addMoveListeners(func:Function){
        this.moveListeners.push(func);
    }

    connect(url: string): Promise<Socket> {
        return new Promise((res, rej) => {
            let socket = io(url);
            if (!socket) rej();
            else {
                this.socket = socket;
                socket.on('connect', () => {
                    res(socket as Socket);
                })
               
                socket.on('error', (err) => { rej(err) });
            }
            
        })
    }
    listenForMove():Promise<any>{
        return new Promise((res,rej)=>{
            if (this.socket) {
                try {
                    this.socket.on(eveNames.listen_to_move,({player, pos, room_id})=>{
                        res({player,pos,room_id})
                    });
                    this.socket.on('error', (err) => rej(err));
                } catch (error) {
                    rej(error);
                }
            } else {
                rej("Socket obj is null!");
            }
        })
    }
    joinRoom(game_id: string,onRoomJoin?:Function) {
        return new Promise((res, rej) => {
            const onJoin = () => {
                res(this.socket);
                console.log("********* Joined ************* ");
                if(onRoomJoin)onRoomJoin();
            }
            if (this.socket) {
                try {
                    this.socket.emit(eveNames.join_room, game_id, onJoin);
                    this.socket.on('error', (err) => rej(err));
                } catch (error) {
                    rej(error);
                }
            } else {
                rej("Socket obj is null!");
            }
        })
    }
    makeMove(player: 1 | 0, pos: number, room_id: string, onMoveMade?: Function) {

        return new Promise((res, rej) => {
            const move_made = (props: any) => {
                if (onMoveMade) onMoveMade(this.socket);
                res(props);
            }
            if (this.socket) {
                try {

                    this.socket.emit(eveNames.move_made, { player, pos, room_id, move_made });
                    this.socket.on('error', (err) => rej(err));
                } catch (error) {
                    rej(error);
                }
            } else { rej(); }

        })
    }
}
export default new SocketService();