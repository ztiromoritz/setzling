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
  clientId: string,
  name?: string,
  position: Point,
  controls: Controls,
  communicationRange: number
}

export interface GameState {
    id: GameId;
    players : Player[],
}
