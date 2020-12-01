import * as Phaser from 'phaser';
import {MainScene} from "./scenes/mainScene";
import {StateHandler} from "./store/stateHandler";
import {CustomGame} from "./types/customGame";
import {PreloadScene} from "./scenes/preloadScene";
import {appendJitsiIntegration} from "./communication/jitsi";
import {debugHelper} from "./debug";

const gameConfig: any /* GameConfig seems to be wrong */ = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    backgroundColor: '#000000',
    scene: [PreloadScene, MainScene],
    pixelArt: true,
    parent: 'grid-main'
}

const game: CustomGame = new Phaser.Game(gameConfig) as CustomGame;

game.stateHandler = new StateHandler();

// appendJitsiIntegration("kevintrompeteisthier");

debugHelper.initPerformanceDebug();


