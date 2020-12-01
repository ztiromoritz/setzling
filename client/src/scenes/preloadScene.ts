import Phaser from "phaser";
import {Assets, toneAssets} from "../assets";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;

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
        this.load.image('tileset', './assets/tree.png');
    }
    async create(data: object){
        toneAssets.toneResources = await Assets.loadTone();
        this.scene.start("MainScene");
    }
}