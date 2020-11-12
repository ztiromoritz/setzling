import { GameDriver } from "./GameDriver";
import { GameId } from "setzling-common";
import { Game } from "./Game";


export class GameStore {
    private games: Map<GameId,GameDriver>;

    constructor(){
        this.games = new Map();

        const gameId = 'default';
        const defaultGame = new Game(gameId);
        const gameDriver = new GameDriver(defaultGame);
        this.games.set(gameId, gameDriver);
        gameDriver.start();
    }

    getGameDriver(gameId:GameId):GameDriver | undefined{
        return this.games.get(gameId)
    }
}