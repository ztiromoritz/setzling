import Phaser from "phaser";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import {loadTone} from "../sound/assets";
import * as Tone from "tone";
import {bindKeysToSounds} from "../sound/soundKey";
import {CustomGame} from "../types/customGame";

export class PreloadScene extends Phaser.Scene {
    get key(){
        return "PreloadScene";
    }
    constructor(config: SettingsConfig = {}) {
        Object.assign(config , {key:'PreloadScene'});
        super(config);
    }
    preload(){
        this.load.spritesheet('tree', './assets/tree.png', {frameHeight: 128, frameWidth: 64});
        this.load.spritesheet('setzling', './assets/setzling.png', {frameHeight: 16, frameWidth: 16} );
        this.load.spritesheet('character', './assets/characterAnimationSpritesheet.png', {frameHeight: 16, frameWidth: 16} );
        this.load.image('tileset', './assets/Tileset.png');
    }
    async create(data: object){
        const toneResources = await loadTone();
        (this.game as CustomGame).toneResources = toneResources;



        this.scene.start("MainScene");
    }
}