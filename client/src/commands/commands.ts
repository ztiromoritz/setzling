import { ClientId, SelectInventoryItemMessage } from "setzling-common";
import { PlaceElementMessage } from "setzling-common";
import { Connection } from "../store/connectionHandler";

export class Commands {
    connection: Connection;
    constructor(connection: Connection) {
        this.connection = connection;
    }

    public placeElement(x: number, y: number): void {
        console.log("placeElement", x, y);
        const clientId = this.connection.getLocalState().clientId;
        const player = this.connection.getGameState().players.find((player) => player.clientId === clientId);
        if (clientId && player) {
            const msg: PlaceElementMessage = {
                type: 'PlaceElement',
                options: {
                    position: { x, y },
                    from: {
                        clientId,
                        inventoryIndex: player.items.selected
                    }
                }
            }
            this.connection.getWebSocket().send(JSON.stringify(msg));
        }
    }


    public selectInventoryItem(index: number): void {
        const msg: SelectInventoryItemMessage = {
            type: "SelectInventoryItem",
            index
        };
        console.log("dafs", this.connection);
        this.connection.getWebSocket().send(JSON.stringify(msg));
    }

}