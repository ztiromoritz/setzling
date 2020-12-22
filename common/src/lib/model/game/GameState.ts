import {Tilemap} from "./Tilemap";

export type GameId = string;

export type ClientId = string;

export interface Point {
  x: number,
  y: number
}

export interface Controls {
  arrows : {
    up: boolean,
    down: boolean,
    left: boolean,
    right: boolean
  }
}

export interface Player {
  clientId: ClientId,
  name?: string,
  position: Point,
  controls: Controls,
  communicationRange: number
  lastHorizontalDirection: HorizontalDirection
}

export type HorizontalDirection = number; // <0: left, >=0: right

export type JitsiRoomId = string;

export interface JitsiCommunication {
  roomId: JitsiRoomId,
  participants: Player[]
}

export interface GameState {
    id: GameId;
    jitsiSessions: JitsiCommunication[],
    players : Player[],
    map : Tilemap
}
