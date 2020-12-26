import { SelectInventoryItemMessage } from "setzling-common";
import { PlaceElementMessage } from "setzling-common";
import { Connection } from "../store/connectionHandler";

export class Commands {
    connection: Connection;
    constructor(connection: Connection) {
        this.connection = connection;
    }

    public placeElement(x: number, y: number):void {
        console.log("placeElement", x,y);
        const msg: PlaceElementMessage = {
            type: 'PlaceElement',
            options: { x, y }
        }
        this.connection.getWebSocket().send(JSON.stringify(msg));
    }


    public selectInventoryItem(index: number): void {
        const msg: SelectInventoryItemMessage = {
            type: "SelectInventoryItem",
            index
        };
        console.log("dafs",this.connection);
        this.connection.getWebSocket().send(JSON.stringify(msg)); 
    }

}