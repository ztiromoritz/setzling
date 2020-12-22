import Phaser from "phaser";
import {loadTone} from "../sound/assets";
import {CustomGame} from "../types/customGame";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;

export class LoginScene extends Phaser.Scene {
    get key(){
        return "LoginScene";
    }
    constructor(config: SettingsConfig = {}) {
        Object.assign(config, {key:'LoginScene'});
        super(config);
    }
    async create(data: object){
        const stateHandler = (this.game as CustomGame).stateHandler;
        const activeState = await stateHandler.connect();
        console.log("LoginScene#create");
        this.scene.start("MainScene", activeState);
    }
}