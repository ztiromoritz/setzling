import { Connection } from "../store/connectionHandler";

export class Commands {
    connection: Connection;
    constructor(connection: Connection) {
        this.connection = connection;
    }

    public placeElement(x: number, y: number):void {
        console.log("placeElement", x,y);
        const msg = {
            type: 'PlaceElement',
            options: { x, y }
        }
        this.connection.getWebSocket().send(JSON.stringify(msg));
    }

}