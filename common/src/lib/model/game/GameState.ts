import { Player } from "./Player";
import {Tilemap} from "./Tilemap";

export type GameId = string;

export type JitsiRoomId = string;

export interface JitsiCommunication {
  roomId: JitsiRoomId,
  participants: Player[]  // TODO: I think this should be only PlayerIds (normalization)
}

export interface GameState {
    id: GameId;
    jitsiSessions: JitsiCommunication[],
    players : { [playerId:string]:Player },
    map : Tilemap
}
