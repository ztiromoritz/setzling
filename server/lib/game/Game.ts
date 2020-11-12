import { GameState, GameId, ClientMessage, Player, Point, ControlUpdateMessage } from 'setzling-common';
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
            const clientId = userMessage?.message.clientId
            const player = gameState.players
                .find((player: Player) => player.clientId === clientId);
            if (userMessage.message.type === 'JoinGame') {
                if (!player) {
                    gameState.players.push({
                        clientId,
                        position: getRandomPoint(),
                        controls: {
                            arrows: { up: false, down: false, left: false, right: false }
                        }
                    })
                }
            } else if (userMessage.message.type === 'LeaveGame') {
                if (!player) {
                    gameState.players = gameState.players
                        .filter((player: Player) => player.clientId !== clientId)
                }
            } else if (userMessage.message.type === 'UserControl') {
                const message = userMessage.message as ControlUpdateMessage;
                if (player) {
                    Object.assign(player.controls, userMessage.message.controls);
                }

            }
        }
    }

    private movement(gameState: GameState) {
        gameState.players.forEach((player)=>{
            let dx = 0;
            let dy = 0;
            if(player.controls.arrows.up){
                dy = -1;
            }
        })
    }

    public pushClientMessage(message: ClientMessage) {

    }

    public sendUserMessage(message: any, clientId: string) {
        this.messageQueue.push({ message, clientId })
    }


}