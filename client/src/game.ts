import * as Phaser from 'phaser';
import { MainScene } from "./scenes/mainScene";
import { ConnectionHandler } from "./store/connectionHandler";
import { CustomGame } from "./types/customGame";
import { PreloadScene } from "./scenes/preloadScene";
import { appendJitsiIntegration } from "./communication/jitsi";
import { debugHelper } from "./debug";
import { LoginScene } from "./scenes/loginScene";
import "./ui/ui";

const zoom = 3;
const gameConfig: any /* GameConfig seems to be wrong */ = {
    type: Phaser.AUTO,

    scale: {
        mode: Phaser.Scale.NONE,
        width: window.innerWidth / zoom,
        height: window.innerHeight / zoom,
        zoom: zoom
    },
    backgroundColor: '#000000',
    zoom,
    scene: [PreloadScene, LoginScene, MainScene],
    pixelArt: true,
    parent: 'phaser'
}

window.addEventListener("resize", () => {
    game.scale.resize(window.innerWidth / zoom, window.innerHeight / zoom);
}, false);

const game: CustomGame = new Phaser.Game(gameConfig) as CustomGame;
game.connectionHandler = new ConnectionHandler();




// appendJitsiIntegration("kevintrompeteisthier");

debugHelper.initPerformanceDebug();


