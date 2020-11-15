import { GameHistory, SnapshotId } from "./GameDriver";
import {
    ClientMessageHandler,
    ClientMessageType, CommunicationRangeUpdateMessage, ControlUpdateMessage,
    GameId, GameState,
    JoinGameMessage,
    LeaveGameMessage, UpdateStateMessage
} from "setzling-common";
import { Server } from "ws";
import * as WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { GameStore } from "./GameStore";
import { GameClientNotifier } from "./GameClientNotifier";



type GameClient = {
    currentSnapshotId: SnapshotId | null
    currentPatchIndex: number
    gameId: GameId | null
    socket: WebSocket
    id: string
};

const NOT_EQUAL = (client: any) => (_: any) => (_.id !== client.id)
const HAS_GAME_ID = (gameId: GameId) => (_:GameClient)=> _.gameId === gameId;

export class GameClientHandler implements GameClientNotifier {
    private clients: GameClient[];

    constructor(server: Server, gameStore: GameStore) {
        this.clients = [];
        server.on('connection', (socket: WebSocket) => {
            console.log("connection");
            let client: GameClient = {
                socket,
                id: uuidv4(),
                currentSnapshotId: null,
                currentPatchIndex: 0,
                gameId: null
            }
            this.clients.push(client);
            console.log(this.clients.length)
            const messageHandler = this.createClientMessageHandler(client, gameStore);

            socket.on('message', (msg) => {
                if (typeof msg === 'string') {
                    const message = JSON.parse(msg) as any;
                    // @ts-ignore
                    messageHandler[message.type]?.call(this, message);
                }
            });

            socket.on('close', () => {
                console.log("close",  this.clients.length);
                const gameId = client.gameId;
                if(gameId){
                    console.log("LeaveOnClose")
                    const gameDriver = gameStore.getGameDriver(gameId);
                    const msg = {

                    }
                    gameDriver?.sendUserMessage({
                        type: 'LeaveGame',
                        options: {
                            gameId
                        }
                    }, client.id)
                }
                this.clients = this.clients.filter(NOT_EQUAL(client));
                console.log("close filter",  this.clients.length);
            });
        });
    }


    notifyClients(gameId: GameId, history: GameHistory): void {

        this.clients
            .filter(HAS_GAME_ID(gameId))
            .forEach(client => {
                if (history.snapshotId !== client.currentSnapshotId) {
                    const message: UpdateStateMessage = {
                        type: 'UpdateState',
                        options: {
                            snapshot: history.snapshot,
                            patches: history.patches
                        }
                    };
                    client.currentPatchIndex = history.patches.length;
                    client.currentSnapshotId = history.snapshotId;
                    client.socket.send(JSON.stringify(message));
                } else {
                    const patches = history.patches.slice(client.currentPatchIndex);
                    if(patches.length === 0)
                        return // No changes
                    const message: UpdateStateMessage = {
                        type: 'UpdateState',
                        options: {
                            patches,
                            snapshot: null
                        }
                    };
                    client.currentPatchIndex = history.patches.length;
                    client.socket.send(JSON.stringify(message));
                }
            })
    }


    private createClientMessageHandler(client: GameClient, gameStore: GameStore): { LeaveGame(message: LeaveGameMessage): void; ControlUpdate(message: ControlUpdateMessage): void; JoinGame(message: JoinGameMessage): void; CommunicationRangeUpdate(message:CommunicationRangeUpdateMessage): void } {
        const dispatch = (message: any, gameId:GameId|null)=>{
            if (gameId) {
                client.gameId;
                const gameDriver = gameStore.getGameDriver(gameId as GameId);
                if(gameDriver){
                    gameDriver.sendUserMessage(message, client.id)
                }else{
                    console.log(`No game found with id ${gameId}`)
                }
            }else{
                console.log(`No gameId send in JoinGameMessage`);
            }
        }

        return {
            JoinGame(message: JoinGameMessage) {
                const gameId = message?.options.gameId;
                client.gameId = gameId;
                dispatch(message, gameId);
            },
            LeaveGame(message: LeaveGameMessage) {
                // TODO: check client.gameId here
                const gameId = message?.options.gameId;
                client.gameId = null;
                dispatch(message, gameId);
            },
            ControlUpdate(message: ControlUpdateMessage) {
                const gameId = client.gameId;
                dispatch(message, gameId);
            },
            CommunicationRangeUpdate(message: CommunicationRangeUpdateMessage) {
                const gameId = client.gameId;
                dispatch(message, gameId);
            }
        }
    }


}