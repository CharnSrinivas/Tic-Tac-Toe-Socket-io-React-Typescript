import { Server,Socket} from 'socket.io';
import { createServer } from "http";
import * as eve_names from './eventNames'
import app from './app';
import *as interfaces from './interfaces'
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: '*' }
})


function disconnectPlayer(socket:Socket,room_id:string,data:any,onLeft?:Function){
    if(data)
    {socket.broadcast.to(room_id).emit(eve_names.player_left,data);}else{socket.broadcast.to(room_id).emit(eve_names.player_left);}
    console.log("disconnecting.....");
    if (onLeft) onLeft();

    socket.disconnect();
}
io.on('connection', (socket: Socket) => {
    //?🚪🚪 Join room

    socket.on(eve_names.join_room,
        (room_id: string, onJoin?: Function) => {
            if (io.sockets.adapter.rooms.get(room_id) && !io.sockets.adapter.sids.get(socket.id)?.has(room_id)) {
                let room_size = io.sockets.adapter.rooms.get(room_id)!.size;
                if (room_size <= 2) {
                    socket.join(room_id);
                    socket.broadcast.emit(eve_names.opponent_joined,room_id,socket.id);
                } else {
                }
            } else {
                socket.join(room_id);
            }
        //     console.log(`
        // ${socket.id} joining to room ${room_id} 
        // Room size : ${io.sockets.adapter.rooms.get(room_id)?.size}
        // `);
            if (onJoin) { onJoin({ room_id }); }
        })


    //? 🎲🎲 making move
    socket.on(eve_names.move_made,
        ({ player, pos, room_id, onMoveMade }: interfaces.Move) => {
            // console.log(`${p} -> ${pos}`);
            //? Sending moves to all player
            io.to(room_id).emit(eve_names.listen_to_move, { player, pos, room_id })
            if (onMoveMade) onMoveMade({ player, pos, room_id, onMoveMade });
        })

    // ? 🔐 🔐 closing game

    socket.on(eve_names.close_game,
         (room_id, player: number, onLeft?: Function) => {
            disconnectPlayer(socket,room_id,player,onLeft);
            // console.log(await io.sockets.in(room_id).allSockets())
        })

    // ? 🔗🔗 Disconnection

    socket.on('disconnect', () => {
        socket.rooms.forEach(room_id=>{
            socket.broadcast.to(room_id).emit(eve_names.player_left);
        })
        console.warn("Unexpected disconnection");
        socket.disconnect()
    })
})

export default httpServer;
