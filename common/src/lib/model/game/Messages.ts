import { Patch } from "immer";

import { Controls, GameId, GameState } from "./GameState";

// Client Messages
export type ClientMessageType =
  'JoinGame' |
  'LeaveGame' |
  'ControlUpdate'

export type JoinGameMessage = {
  type: 'JoinGame',
  options: {
    gameId: GameId
  }
}

export type LeaveGameMessage = {
  type: 'LeaveGame',
  options: {
    gameId: GameId
  }
}

export type ControlUpdateMessage = {
  type: 'ControlUpdate',
  options: {
    controls : Controls
  }
}

export type CommunicationRangeUpdateMessage = {
  type: 'CommunicationRangeUpdate',
  options: {
    range : number
  }
}

export type ClientMessageHandler = {
  JoinGame?: (msg: JoinGameMessage) => void,
  LeaveGame?: (msg: LeaveGameMessage) => void,
  ControlUpdate?: (msg: ControlUpdateMessage) => void
  CommunicationRangeUpdate?: (msg: CommunicationRangeUpdateMessage) => void
}


// Server Messages
export type ServerMessageType =
  'UpdateState'

export type ServerMessage = {
  type: ServerMessageType,
  options: { [id: string]: string | number | boolean }
}

export type UpdateStateMessage = {
  type: 'UpdateState'
  options: {
    snapshot: GameState | null,
    patches: Patch[]
  }
}


export type ServerMessageHandler = {
  UpdateState?: (msg: UpdateStateMessage) => void
}
