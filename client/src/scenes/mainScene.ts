import Phaser from "phaser";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import {debugHelper} from "../debug";
import {CustomGame} from "../types/customGame";
import {Player} from "../../../common/build/module";
import {createFloorLayer} from "../map/map";
import {bindKeysToSounds} from "../sound/soundKey";


export class MainScene extends Phaser.Scene {
    private seedlings!: Phaser.GameObjects.Sprite[];
    private communicationRanges!: Phaser.GameObjects.Graphics;
    private tree!: Phaser.GameObjects.Sprite;
    private floorLayer!: Phaser.Tilemaps.DynamicTilemapLayer;

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
        this.floorLayer = createFloorLayer(this, 300,300);
        this.floorLayer.setScale(2,2);
        bindKeysToSounds((this.game as CustomGame).toneResources);

        /*
        this.cameras.main.setSize(1200,800);
        const stateHandler = (this.game as CustomGame).stateHandler;
        const gameState = stateHandler.getGameState();
        const localState = stateHandler.getLocalState();
        const me = gameState.players.find((player) => player.clientId === localState.clientId);
        if(me){
            this.cameras.main.startFollow(me);
        }*/
    }

    update(time:number, delta:number){
        const stateHandler = (this.game as CustomGame).stateHandler;
        if(!stateHandler.isStateDirty())
            return;

        const gameState = stateHandler.getGameState();
        const localState = stateHandler.getLocalState();

        const me = gameState.players.find((player) => player.clientId === localState.clientId);
        if(me){
            this.cameras.main.scrollX = me.position.x - 600;
            this.cameras.main.scrollY = me.position.y - 400;
        }



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
            seedling.setScale(3,3);
            seedlings.push(seedling);
            this.add.existing(seedling);
        }
        return seedlings;
    }
}