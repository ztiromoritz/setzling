import {
    GameState,
    GameId,
    Point,
    Player,
    ControlUpdateMessage,
    CommunicationRangeUpdateMessage,
    LoginMessage, PlaceElementMessage, ClientId, SelectInventoryItemMessage, ItemRegistry, ItemInstance
} from 'setzling-common';

import { v4 as uuidv4 } from 'uuid';
import produce, { applyPatches } from "immer"

// version 6
import { enablePatches } from "immer"
import { findSourceMap } from 'module';

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
            const clientId = userMessage?.clientId
            const player = gameState.players[clientId];
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
                                // TODO: load & store these infos from player account
                                selected: 0,
                                inventory: [
                                    {
                                        id: 'asdfasdkhasdf',
                                        amount: 1,
                                        bluprint: true,
                                        itemId: 'item_fire',
                                        state: {
                                            burning: false
                                        }
                                    },
                                    {
                                        id: 'rdftugizbijoik',
                                        amount: 1,
                                        bluprint: true,
                                        itemId: 'item_acorn',
                                        state: {}
                                    }
                                ],
                                bag: []
                            }
                        };
                        gameState.players[clientId] = newPlayer;
                    }
                    break;
                case 'LeaveGame':
                    console.log('LeaveGame')
                    if (player) {
                        delete gameState.players[clientId]
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
                    const { position, from } = message.options;
                    if (player && player.clientId == message.options.from.clientId) {
                        const itemInstance = player.items.inventory[from.inventoryIndex];
                        if (itemInstance) {
                            const item = ItemRegistry.get(itemInstance.itemId);
                            if (!item) {
                                console.log("Cannot place - no item in inventory index " + from.inventoryIndex)
                                break;
                            }
                            if (item.placeable) {
                                if (itemInstance.bluprint) {
                                    // Create newItem from blueprint   
                                    const id = uuidv4();
                                    const newItem: ItemInstance = {
                                        id,
                                        amount: 1,
                                        bluprint: false,
                                        itemId: itemInstance.itemId,
                                        state: JSON.parse(JSON.stringify(
                                            itemInstance.state
                                        )),
                                        position: { ...position }
                                    }
                                    gameState.map.objects[id] = newItem;
                                } else {
                                    if (item.stackable && itemInstance.amount > 1) {
                                        // Create newItem by taking one from stack
                                        itemInstance.amount--;
                                        const id = uuidv4();
                                        const newItem: ItemInstance = {
                                            id,
                                            amount: 1,
                                            bluprint: false,
                                            itemId: itemInstance.itemId,
                                            state: JSON.parse(JSON.stringify(
                                                itemInstance.state
                                            )),
                                            position: { ...position }
                                        }
                                        gameState.map.objects[id] = newItem;
                                    } else {
                                        // Move item from inventory to place
                                        itemInstance.position = { ...position }
                                        delete player.items.inventory[from.inventoryIndex];
                                        gameState.map.objects[itemInstance.id] = itemInstance;
                                    }
                                }
                            }
                        }
                    }
                    break;
                case 'SelectInventoryItem':
                    message = userMessage.message as SelectInventoryItemMessage;
                    if (player && message.index >= 0 && message.index <= 9) {
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
        Object.keys(gameState.players).forEach((clientId: string) => {
            const player = gameState.players[clientId];
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
        this.messageQueue.push({ message, clientId })
    }


}