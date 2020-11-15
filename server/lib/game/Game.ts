import {GameState, GameId, Player, Point, ControlUpdateMessage, CommunicationRangeUpdateMessage} from 'setzling-common';
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
            console.log("userMessage",JSON.stringify(userMessage,null,2))
            const clientId = userMessage?.clientId
            const player = gameState.players
                .find((player: Player) => player.clientId === clientId);
            switch (userMessage.message.type) {
                case 'JoinGame':
                    if (!player) {
                    console.log("push")
                        gameState.players.push({
                            clientId,
                            position: getRandomPoint(),
                            controls: {
                                arrows: { up: false, down: false, left: false, right: false }
                            },
                            communicationRange: 50
                        })
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
                    const message = userMessage.message as ControlUpdateMessage;
                    if (player) {
                        player.controls = userMessage.message.options.controls;
                    }
                    break;
                case 'CommunicationRangeUpdate':
                    if (player) {
                        const message = userMessage.message as CommunicationRangeUpdateMessage;
                        player.communicationRange = message.options.range;
                    }
                    break;
                default:
                    console.error("Unexpected message type: "+userMessage.message.type)
                    break;
            }
        }
    }

    private movement(gameState: GameState) {
        let speed = 2;
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
                dx = -speed
            }
            if (right) {
                dx = speed
            }
            player.position.x += dx;
            player.position.y += dy;
        })
    }


    public sendUserMessage(message: any, clientId: string) {
        this.messageQueue.push({ message, clientId })
    }


}