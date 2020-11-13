import { GameDriver } from "./GameDriver";
import { GameId } from "setzling-common";
import { Game } from "./Game";
import { GameClientNotifier } from "./GameClientNotifier";


export class GameStore {
    private games: Map<GameId,GameDriver>;
    private clientNotifier?: GameClientNotifier;

    constructor(){
        this.games = new Map<GameId, GameDriver>();
    }

    init(){
        const gameId = 'default';
        const defaultGame = new Game(gameId);
        const gameDriver = new GameDriver(defaultGame, this.clientNotifier);
        this.games.set(gameId, gameDriver);
        gameDriver.start();
    }

    getGameDriver(gameId:GameId):GameDriver | undefined{
        return this.games.get(gameId)
    }

    setClientNotifier(clientNotifier: GameClientNotifier) {
        this.clientNotifier = clientNotifier;
    }
}