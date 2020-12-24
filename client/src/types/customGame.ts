import Phaser from "phaser";
import {ConnectionHandler} from "../store/connectionHandler";
import {ToneResources} from "../sound/assets";
import { Commands } from "../commands/commands";

export interface CustomGame extends Phaser.Game {
    commands : Commands,
    connectionHandler: ConnectionHandler,
    customData: { [id: string]: any },
    toneResources: ToneResources
}