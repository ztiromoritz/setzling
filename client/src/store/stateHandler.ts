import {initializeRangeSlider} from "../controls/rangeSlider";
import {initializeKeys} from "../controls/keys";
import {applyPatches, enablePatches} from "immer";
import {GameState, LoginMessage} from "../../../common/build/module";

enablePatches();

export type LocalState = {
    clientId: string | undefined
}

export class StateHandler {
    private state: GameState;
    private localState: LocalState ;
    private stateIsDirty: boolean;

    constructor() {
        // State-update & message handling
        this.stateIsDirty = false;
        this.state = {id: "", jitsiSessions: [], players: []};
        this.localState = {clientId: undefined};




        const ws = new WebSocket((window as any).WEB_SOCKET_BASE_URL);
        ws.onopen = function (event) {
            let gameId = 'default';
            const msg = {
                type: 'JoinGame',
                options: {
                    gameId: gameId
                }
            }
            console.log("Joined game: " + gameId);
            ws.send(JSON.stringify(msg));

            initializeRangeSlider(ws);
            initializeKeys(ws);
        };

        ws.onmessage = (() => {
            return (event: MessageEvent) => {
                const message = JSON.parse(event.data);
                switch (message.type) {
                    case 'UpdateState':
                        // console.log('UpdateState', message.options);
                        if (message.options.snapshot) {
                            this.state = message.options.snapshot
                        }
                        if (message.options.patches) {
                            this.state = applyPatches(this.state || {}, message.options.patches);
                        }
                        this.stateIsDirty = true;
                        break;
                    case "Login":
                        let clientId: string = (message as LoginMessage).options.clientId;
                        console.log("My client ID is " + clientId);
                        this.localState.clientId = clientId;
                        break;
                    default:
                        console.error("Unable to handle incoming websocket message of type: " + message.type);
                        break;
                }
            }
        })();

    }

    isStateDirty():boolean{
        return this.stateIsDirty;
    }

    getLocalState(): LocalState {
        return this.localState;
    }

    getGameState(): GameState {
        return this.state;
    }
}

