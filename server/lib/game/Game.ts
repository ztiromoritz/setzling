import {
    GameState,
    GameId,
    Point,
    Player,
    ControlUpdateMessage,
    CommunicationRangeUpdateMessage,
    LoginMessage, PlaceElementMessage, MapObject, ClientId, SelectInventoryItemMessage
} from 'setzling-common';

import { v4 as uuidv4 } from 'uuid';
import produce, { applyPatches } from "immer"

// version 6
import { enablePatches } from "immer"

enablePatches()


// TODO:  Move
function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPoint(): Point {
    return {
        x: getRandomInt(0, 500),
        y: getRandomInt(0, 500)
    }
}

// ================


type UserMessage = {
    message: any;
    clientId: string;
}


export class Game {
    readonly id: GameId;
    private messageQueue: UserMessage[];

    constructor(id: GameId) {
        this.id = id;
        this.messageQueue = [];
    }

    update(gameState: GameState) {
        this.handleClientMessages(gameState);
        this.movement(gameState);
    }


    private handleClientMessages(gameState: GameState) {

        const playerMoves = {}

        let userMessage: UserMessage | undefined;
        while ((userMessage = this.messageQueue.shift()) !== undefined) {
            console.log("userMessage", JSON.stringify(userMessage, null, 2))
            const clientId = userMessage?.clientId
            const player = gameState.players
                .find((player: Player) => player.clientId === clientId);
            let message;
            switch (userMessage.message.type) {
                case 'JoinGame':
                    if (!player) {
                        const newPlayer: Player = {
                            clientId,
                            position: getRandomPoint(),
                            controls: {
                                arrows: { up: false, down: false, left: false, right: false }
                            },
                            communicationRange: 50,
                            lastHorizontalDirection: 0,
                            items: {
                                selected: 0,
                                inventory: [
                                    {
                                        amount: 1,
                                        bluprint: true,
                                        itemId: 'fire',
                                        name: 'fire',
                                        itemInstanceId: 'asdfasdkhasdf',
                                        state: {
                                            burning: false
                                        }
                                    },
                                    {
                                        amount: 1,
                                        bluprint: true,
                                        itemId: 'ice',
                                        name: 'icecream',
                                        itemInstanceId: 'jkfadskljdfsjkl',
                                        state: {
                                            burning: false
                                        }
                                    }
                                ],
                                bag: []
                            }
                        };
                        gameState.players.push(newPlayer)
                    }
                    break;
                case 'LeaveGame':
                    console.log('LeaveGame')
                    if (player) {
                        gameState.players = gameState.players
                            .filter((player: Player) => player.clientId !== clientId)
                    }
                    break;
                case 'ControlUpdate':
                    //  console.log('ControlUpdate', player)
                    message = userMessage.message as ControlUpdateMessage;
                    if (player) {
                        player.controls = userMessage.message.options.controls;
                    }
                    break;
                case 'CommunicationRangeUpdate':
                    if (player) {
                        message = userMessage.message as CommunicationRangeUpdateMessage;
                        player.communicationRange = message.options.range;
                    }
                    break;
                case 'PlaceElement':
                    message = userMessage.message as PlaceElementMessage;
                    console.log("Placing fallback dummy element at " + message.options.x + "," + message.options.y)
                    if (player) {
                        const { x, y } = message.options;
                        const id = uuidv4();
                        const testObject: MapObject = { template: "TestTemplate", position: { x, y }, id };
                        gameState.map.objects.push(testObject);
                    }

                    break;

                case 'SelectInventoryItem':
                    message = userMessage.message as SelectInventoryItemMessage;
                    if(player && message.index >=0 && message.index <= 9){
                        player.items.selected = message.index;
                    }
                    break;
                default:
                    console.error("Unexpected message type: " + userMessage.message.type)
                    break;
            }
        }
    }

    private movement(gameState: GameState) {
        let speed = 1;
        gameState.players.forEach((player) => {
            let dx = 0;
            let dy = 0;
            const { up, down, left, right } = player.controls.arrows
            if (up) {
                dy = -speed;
            }
            if (down) {
                dy = speed;
            }
            if (left) {
                player.lastHorizontalDirection = -1;
                dx = -speed
            }
            if (right) {
                player.lastHorizontalDirection = 1;
                dx = speed
            }
            player.position.x += dx;
            player.position.y += dy;
        })
    }


    public sendUserMessage(message: any, clientId: ClientId) {
        console.log("message xxx", message);
        this.messageQueue.push({ message, clientId })
    }


}