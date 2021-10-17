export interface Move {
    player:number,
    pos:number,
    room_id:string;
    onMoveMade?:Function
}