import Phaser from "phaser";
import { Commands } from "../commands/commands";
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
        const stateHandler = (this.game as CustomGame).connectionHandler;
        const connection = await stateHandler.connect();
        (this.game as CustomGame).commands = new Commands(connection);
        this.scene.start("MainScene", connection);
    }
}