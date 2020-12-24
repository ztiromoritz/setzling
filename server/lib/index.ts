import express from 'express';
import dotenv from 'dotenv';
import { StoreController } from "./controller/StoreController";
import { InstanceController } from "./controller/InstanceController";
import WebSocket from 'ws';
import { GameClientHandler } from "./game/GameClientHandler";
import { GameStore } from "./game/GameStore";
import { InstanceService } from "./service/InstanceService";
import { stringReplace } from "string-replace-middleware";
import { execSync } from "child_process";

const gitHash = execSync('git rev-parse HEAD').toString().trim();


dotenv.config()
const {SERVER_PORT, WS_PORT, WS_BASE_URL, INSTANCE_NAME} = process.env;
const serverPort = Number.parseInt(SERVER_PORT || "7777");
const wsPort = Number.parseInt(WS_PORT || "7778");
const wsBaseUrl = WS_BASE_URL || `ws://localhost:${wsPort}`;
const instanceName = INSTANCE_NAME || 'not-set';




//
// WebSocket
//
const wsServer = new WebSocket.Server({
  port: wsPort
});
console.log(`[ws]: Websocket Server is running at ws://localhost:${wsPort}`)
console.log(`[ws]: Public Websocket url is: ${wsBaseUrl}`)



//
// Engine
//
const gameStore = new GameStore();
const clientHandler = new GameClientHandler(wsServer, gameStore)
gameStore.setClientNotifier(clientHandler);
gameStore.init();


//
// HTTP-Server
//
const app = express();

// REST-Controller
const instanceService = new InstanceService(gameStore); // TODO: may be some dependency injection??
app.use('/api/instances/', new InstanceController(instanceService).getRouter())

// Static files
app.use('/client/',stringReplace({
  '##wsBaseUrl##': wsBaseUrl,
  '##gitHash##': gitHash,
  '##instanceName##': instanceName
}));


app.use('/client',express.static('../client/'))

app.listen(serverPort, '0.0.0.0', () => {
  console.log(`[server]: Server is running at http://localhost:${serverPort}/client`);
});



