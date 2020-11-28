import { Game } from "./Game";
import {produceWithPatches} from "immer";
import {ClientId, GameId, GameState} from "setzling-common";
import { Patch } from "immer/dist/types/types-external";
import { hostname } from "os";
import { GameClientNotifier } from "./GameClientNotifier";


export type SnapshotId = string;

export interface GameHistory {
    snapshotId: 'A'| 'B'; // to notice if snapshot has changed
    snapshot: GameState | null,
    patches: Patch[]
}

const FRAMES_PER_SECOND = 60;
const FRAMES_PER_SNAPSHOT = 120;

export class GameDriver {
    private game: Game;
    private state: GameState;
    private intervalId!: NodeJS.Timeout | null;
    private clientNotifier: GameClientNotifier | undefined;

    constructor(game: Game, clientNotifier: GameClientNotifier | undefined){
        this.game = game;
        this.state = this.initializeState();
        this.clientNotifier = clientNotifier;
    }

    private initializeState(): GameState {
        return {
            id: this.game.id,
            players: [],
            jitsiSessions: []
        }
    }

    start(){
        const history:GameHistory = {
            snapshotId: 'A',
            snapshot: null,
            patches : []
        };
        let frame = 0;
        this.intervalId = setInterval(() => {
            const oldState: GameState = this.state;
            const [newState, patches, inversePatches] = produceWithPatches(oldState,draft=>this.game.update(draft));
            // update history
            //console.log("newState", JSON.stringify(newState,null,2));
            if(frame>FRAMES_PER_SNAPSHOT || !history.snapshot){
                history.snapshotId = (history.snapshotId === 'A')?'B':'A';
                history.snapshot = oldState;
                history.patches = [...patches];
                frame=0;
            }else{
                history.patches.push(...patches);
            }
            this.clientNotifier?.notifyClients(this.game.id, history);
            this.state = newState;
            frame++;
        }, 1000 / FRAMES_PER_SECOND)
    }

    stop(){
        if(this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null;
        }
    }

    sendUserMessage(message : any, clientId: ClientId) { // TODO Message Typing
        this.game.sendUserMessage(message, clientId);
    }


}