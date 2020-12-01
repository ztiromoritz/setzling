import Phaser from "phaser";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import {PixiResources} from "../assets";
import {Sprite} from "pixi.js";
import PIXI from "pixi.js";
import {debugHelper} from "../debug";
import {CustomGame} from "../types/customGame";
import {Player} from "../../../common/build/module";


export class MainScene extends Phaser.Scene {
    private seedlings!: Phaser.GameObjects.Sprite[];
    private communicationRanges: Phaser.GameObjects.Graphics;
    private tree: Phaser.GameObjects.Sprite;

    constructor(config: SettingsConfig = {}) {
        Object.assign(config, {key:'MainScene'});
        super(config);
    }
    init(data:object){

    }
    create(data: object){
        console.log('Create MainScene');
        this.seedlings = this.preallocateSeedlings(20);
        this.communicationRanges = this.add.graphics({x:0,y:0});
        this.tree = this.add.sprite(600,400,'tree',0);
        this.tree.setScale(4,4);

    }

    update(time:number, delta:number){
        const stateHandler = (this.game as CustomGame).stateHandler;
        if(!stateHandler.isStateDirty())
            return;

        const gameState = stateHandler.getGameState();
        const localState = stateHandler.getLocalState();

        const me = gameState.players.find((player) => player.clientId === localState.clientId);

        // seedlings and range
        this.seedlings.forEach(s => s.visible = false);
        this.communicationRanges.clear();
        this.communicationRanges.lineStyle(1, 0xff0000, 0.5);
        let color = 0;
        gameState.players.forEach((player: Player) => {
            const seedling = this.seedlings[color++];
            seedling.x = player.position.x;
            seedling.y = player.position.y;
            seedling.visible = true;
            this.communicationRanges.strokeCircle(player.position.x, player.position.y, player.communicationRange);
        })
    }

    //===
    private preallocateSeedlings(amount: number) {
        const seedlings: Phaser.GameObjects.Sprite[] = [];
        for (let i = 0; i < amount; i++) {
            const seedling = new Phaser.GameObjects.Sprite(this, 0, 0, 'setzling', 0);
            seedling.visible = false;
            seedling.setOrigin(0.5,0.5);
            seedling.setScale(2,2);
            seedlings.push(seedling);
            this.add.existing(seedling);
        }
        return seedlings;
    }
}