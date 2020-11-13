import express from 'express';
import dotenv from 'dotenv';
import { StoreController } from "./lib/controller/StoreController";
import { InstanceController } from "./lib/controller/InstanceController";
import WebSocket from 'ws';
import { GameClientHandler } from "./lib/game/GameClientHandler";
import { GameStore } from "./lib/game/GameStore";
import { InstanceService } from "./lib/service/InstanceService";

dotenv.config()
const {SERVER_PORT, WS_PORT} = process.env;
const serverPort = Number.parseInt(SERVER_PORT || "7777");
const wsPort = Number.parseInt(WS_PORT || "7778");


const wsServer = new WebSocket.Server({
  port: wsPort
});
console.log(`[ws]: Websocket Server is running at ws://localhost:${wsPort}`)

const gameStore = new GameStore();
const clientHandler = new GameClientHandler(wsServer, gameStore)
gameStore.setClientNotifier(clientHandler);
gameStore.init();

const app = express();
app.get('/', (req, res) => res.send('Setzling!'));

const instanceService = new InstanceService(gameStore); // TODO: may be some dependency injection??
app.use('/api/instances/', new InstanceController(instanceService).getRouter())

app.use('/client',express.static('../client/'))

app.listen(serverPort, () => {
  console.log(`[server]: Server is running at https://localhost:${serverPort}`);
});
