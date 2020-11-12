import { GameId } from "setzling-common";
import { GameHistory } from "./GameDriver";

export interface GameClientNotifier{
    notifyClients(gameId: GameId, history: GameHistory): void
}