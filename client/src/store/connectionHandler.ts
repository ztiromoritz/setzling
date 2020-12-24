import {initializeRangeSlider} from "../controls/rangeSlider";
import {initializeServerKeys} from "../controls/keys";
import {applyPatches, enablePatches} from "immer";
import {GameState, LoginMessage} from "../../../common/build/module";

enablePatches();


export type LocalState = {
    clientId: string | undefined
}

export interface Connection {
    isStateDirty():boolean
    getLocalState(): LocalState
    getGameState(): GameState
    getWebSocket(): WebSocket
}

export class ConnectionHandler {
    private state!: GameState;
    private localState: LocalState ;
    private stateIsDirty: boolean;
    private status =  {
        'INITIAL' : false,
        'WEBSOCKT_CREATED' : false,
        'JOIN_REQUEST_SEND' : false,
        'FIRST_MESSAGE_RECEIVED' : false,
        'LOGGED_IN': false,
        'GAME_STATE_INITIALIZED' : false
    }

    constructor() {
        // State-update & message handling
        this.stateIsDirty = false;
        this.localState = {clientId: undefined};
    }

    connect() : Promise<Connection>{
        if(this.status.INITIAL){
            return Promise.reject('connect can only be called once');
        }
        return new Promise<Connection>((resolve, reject)=>{
            this.status.INITIAL = true;
            // timeout
            setTimeout(()=>{
                reject(`Was not able to create connection to server. No Update State was received. ${JSON.stringify(this.status)}`);
            }, 10 * 1000);

            // Connect to websockets
            const ws = new WebSocket((window as any).WEB_SOCKET_BASE_URL);
            this.status.WEBSOCKT_CREATED = true;
            ws.onopen = () => {
                let gameId = 'default';
                const msg = {
                    type: 'JoinGame',
                    options: {
                        gameId: gameId
                    }
                }
                console.log("Joined game: " + gameId);
                ws.send(JSON.stringify(msg));
                this.status.JOIN_REQUEST_SEND = true;

                initializeRangeSlider(ws);
                initializeServerKeys(ws);
            };

            ws.onmessage = (() => {
                return (event: MessageEvent) => {
                    this.status.FIRST_MESSAGE_RECEIVED = true;
                    const message = JSON.parse(event.data);
                    switch (message.type) {
                        case 'UpdateState':
                            // console.log('UpdateState', message.options);
                            if (message.options.snapshot) {
                                this.state = message.options.snapshot
                                if(!this.status.GAME_STATE_INITIALIZED){
                                    this.status.GAME_STATE_INITIALIZED = true;
                                    const that = this;
                                    resolve({
                                        isStateDirty():boolean{
                                            return that.stateIsDirty;
                                        },
                                        getLocalState(): LocalState {
                                            return that.localState;
                                        },
                                        getGameState(): GameState {
                                            return that.state;
                                        },
                                        getWebSocket(): WebSocket {
                                            return ws;
                                        }
                                    })
                                }
                            }
                            if (message.options.patches) {
                                this.state = applyPatches(this.state || {}, message.options.patches);
                            }
                            this.stateIsDirty = true;
                            break;
                        case "Login":
                            let clientId: string = (message as LoginMessage).options.clientId;
                            console.log("My client ID is " + clientId);
                            this.status.LOGGED_IN = true;
                            this.localState.clientId = clientId;
                            break;
                        default:
                            console.error("Unable to handle incoming websocket message of type: " + message.type);
                            break;
                    }
                }
            })();
        })

    }


}

