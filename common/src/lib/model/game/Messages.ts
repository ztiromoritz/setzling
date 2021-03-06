import { Patch } from "immer";
import { GameId, GameState } from "./GameState";
import { ClientId, Controls } from "./Player";

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
    controls: Controls
  }
}

export type PlaceElementMessage = {
  type: 'PlaceElement';
  options: {
      position: {
          x: number;
          y: number;
      }
      from : {
          clientId: ClientId,
          inventoryIndex: number
      }
  };
}

export type SelectInventoryItemMessage = {
  type: 'SelectInventoryItem',
  index: number
}

export type CommunicationRangeUpdateMessage = {
  type: 'CommunicationRangeUpdate',
  options: {
    range: number
  }
}

export type ClientMessageHandler = {
  JoinGame?: (msg: JoinGameMessage) => void,
  LeaveGame?: (msg: LeaveGameMessage) => void,
  PlaceElement?: (msg: PlaceElementMessage) => void,
  ControlUpdate?: (msg: ControlUpdateMessage) => void
  CommunicationRangeUpdate?: (msg: CommunicationRangeUpdateMessage) => void
  SelectInventoryItem?: (message: SelectInventoryItemMessage) => void
}


// === SERVER MESSAGES ===
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

export type LoginMessage = {
  type: "Login",
  options: {
    clientId: ClientId
  }
}


export type ServerMessageHandler = {
  UpdateState?: (msg: UpdateStateMessage) => void
  Login?: (msg: LoginMessage) => void
}
