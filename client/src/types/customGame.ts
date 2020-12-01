import Phaser from "phaser";
import {StateHandler} from "../store/stateHandler";
import {ToneResources} from "../sound/assets";

export interface CustomGame extends Phaser.Game {
    stateHandler: StateHandler,
    customData: { [id: string]: any },
    toneResources: ToneResources
}