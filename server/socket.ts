import { Server, Socket } from 'socket.io';
import { createServer } from "http";
import * as eve_names from './eventNames'
import app from './app';
import *as interfaces from './interfaces'
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: { origin: '*' }
})


io.on('connection', (socket: Socket) => {
    //?🚪🚪 Join room
    socket.on(eve_names.join_room, (room_id: string, onJoin?: Function) => {
        if (io.sockets.adapter.rooms.get(room_id)!=undefined) {
            let room_size = io.sockets.adapter.rooms.get(room_id)!.size;
            if (room_size <= 2) {
                socket.join(room_id);
            }else{
            }
        } else {
            socket.join(room_id);
        }
        console.log(`
        ${socket.id} joining to room ${room_id} 
            Room size : ${io.sockets.adapter.rooms.get(room_id)?.size}
        `);
        if (onJoin) { onJoin({room_id}); }
    })
    //? 🎲🎲 making move
    socket.on(eve_names.move_made, ({ player, pos, room_id ,onMoveMade}: interfaces.Move) => {
        let p = player === 1 ? 'X': 'O'
        console.log(`
        ${p} -> ${pos}
        `);
        
        //? Sending moves to all player
        io.to(room_id).emit(eve_names.listen_to_move,  {player, pos, room_id} )
        if(onMoveMade)onMoveMade({ player, pos, room_id ,onMoveMade});
    })
    // ? 🔐 🔐 closing game
    socket.on(eve_names.close_game, async (room_id, player: number, onLeft?: Function) => {
        socket.broadcast.to(room_id).emit(eve_names.player_left, player);
        socket.disconnect();
        if (onLeft) onLeft();
        console.log(await io.sockets.in(room_id).allSockets())
    })

    // ? 🔗🔗 Disconnection
    socket.on('disconnect', () => {
        socket.disconnect()
    })
})

export default httpServer;
