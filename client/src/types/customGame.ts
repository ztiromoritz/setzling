import Phaser from "phaser";
import {StateHandler} from "../store/stateHandler";

export interface CustomGame extends Phaser.Game {
    stateHandler: StateHandler,
    customData: { [id: string]: any }
}