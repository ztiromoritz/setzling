import Phaser from "phaser";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import { debugHelper } from "../debug";
import { CustomGame } from "../types/customGame";
import { createFloorLayer } from "../map/map";
import { bindKeysToSounds } from "../sound/soundKey";
import { Connection } from "../store/connectionHandler";
import { MapObject, MapObjectId, Player } from "setzling-common";
import TileMarker from "../ui-sprites/tileMarker";
import { initializeUi } from "../ui/vue-app";


export class MainScene extends Phaser.Scene {
    private seedlings!: Phaser.GameObjects.Sprite[];
    private communicationRanges!: Phaser.GameObjects.Graphics;
    private tree!: Phaser.GameObjects.Sprite;
    private floorLayer!: Phaser.Tilemaps.DynamicTilemapLayer;
    private connection!: Connection;
    private mapObjects!: Phaser.GameObjects.Group;
    private mapObjectsSet!: Set<MapObjectId>;
    tileMarker!: TileMarker;


    get key() {
        return "MainScene";
    }
    constructor(config: SettingsConfig = {}) {
        Object.assign(config, { key: 'MainScene' });
        super(config);
    }
    init(data: object) {

    }
    create(data: object) {
        console.log('Create MainScene');
        this.connection = data as Connection;

        

        const floorLayerData = this.connection.getGameState().map.layers[0];
        this.floorLayer = createFloorLayer(this, floorLayerData);
        this.floorLayer.setScale(1, 1);
        this.seedlings = this.preallocateSeedlings(20);
        this.communicationRanges = this.add.graphics({ x: 0, y: 0 });
        this.tree = this.add.sprite(600, 400, 'tree', 0);
        this.tree.setScale(1, 1);

        this.tileMarker = new TileMarker(this, 0, 0);
        this.add.existing(this.tileMarker);

        this.mapObjectsSet = new Set<MapObjectId>();
        this.mapObjects = this.add.group();


        bindKeysToSounds((this.game as CustomGame).toneResources);
    }

    update(time: number, delta: number) {
        if (!this.connection.isStateDirty())
            return;
        const gameState = this.connection.getGameState();
        const localState = this.connection.getLocalState();
        const playAnimationIfNotPlaying = (animation: Phaser.Animations.Animation, sprite: Phaser.GameObjects.Sprite) => {
            if (!(sprite.anims.currentAnim == animation && sprite.anims.isPlaying)) {
                sprite.anims.play(animation);
            }
        }


        gameState.map.objects.forEach((mapObject) => {
            if (!this.mapObjectsSet.has(mapObject.id)) {
                const { x, y } = mapObject.position;
                const objectSprite = this.add.sprite(x, y, 'objects', 0);
                objectSprite.setOrigin(0, 0);
                const fireAnmation = objectSprite.anims.animationManager.get("fire");

                playAnimationIfNotPlaying(fireAnmation, objectSprite);
                objectSprite.anims.animationManager.add
                this.mapObjects.add(objectSprite);
                this.mapObjectsSet.add(mapObject.id);
            }
        })



        const me = gameState.players.find((player) => player.clientId === localState.clientId);
        if (me) {
            this.cameras.main.scrollX = me.position.x - this.game.scale.width / 2;
            this.cameras.main.scrollY = me.position.y - this.game.scale.height / 2
        }



        // seedlings and range
        this.seedlings.forEach(s => s.visible = false);
        this.communicationRanges.clear();
        this.communicationRanges.lineStyle(1, 0xff0000, 0.5);
        let color = 0;

        function updateAnimation(seedling: Phaser.GameObjects.Sprite, player: Player) {
            let animationUp;
            let animationSide;
            let animationDown = seedling.anims.animationManager.get("walk-down");
            let frameStand;


            if (player.lastHorizontalDirection < 0) {
                animationUp = seedling.anims.animationManager.get("walk-up-left");
                animationSide = seedling.anims.animationManager.get("walk-left");
                frameStand = 4;
            } else {
                animationUp = seedling.anims.animationManager.get("walk-up-right");
                animationSide = seedling.anims.animationManager.get("walk-right");
                frameStand = 0;
            }

            if (player.controls.arrows.up) {
                playAnimationIfNotPlaying(animationUp, seedling);
            } else if (player.controls.arrows.right || player.controls.arrows.left) {
                playAnimationIfNotPlaying(animationSide, seedling);
            } else if (player.controls.arrows.down) {
                playAnimationIfNotPlaying(animationDown, seedling);
            } else {
                seedling.anims.stop();
                seedling.setFrame(frameStand);
            }
        }

        gameState.players.forEach((player) => {
            const seedling = this.seedlings[color++];
            updateAnimation(seedling, player);
            seedling.x = player.position.x;
            seedling.y = player.position.y;
            seedling.visible = true;
            this.communicationRanges.strokeCircle(player.position.x, player.position.y, player.communicationRange);
        })
    }

    //===
    private preallocateSeedlings(amount: number) {
        const seedlings: Phaser.GameObjects.Sprite[] = [];
        this.setupAnimations();
        for (let i = 0; i < amount; i++) {
            const seedling = new Phaser.GameObjects.Sprite(this, 0, 0, 'character', 0);
            seedling.visible = false;
            seedling.setOrigin(0.5, 0.5);
            seedling.setScale(1, 1);
            seedlings.push(seedling);
            this.add.existing(seedling);
        }
        return seedlings;
    }

    private setupAnimations() {
        const framerate = 8;
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('character', { start: 1, end: 3 }),
            frameRate: framerate,
            repeat: -1,
            yoyo: true
        });
        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('character', { start: 5, end: 7 }),
            frameRate: framerate,
            repeat: -1,
            yoyo: true
        });
        this.anims.create({
            key: 'walk-up-right',
            frames: this.anims.generateFrameNumbers('character', { start: 9, end: 11 }),
            frameRate: framerate,
            repeat: -1,
            yoyo: true
        });
        this.anims.create({
            key: 'walk-up-left',
            frames: this.anims.generateFrameNumbers('character', { start: 13, end: 15 }),
            frameRate: framerate,
            repeat: -1,
            yoyo: true
        });
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('character', { start: 17, end: 19 }),
            frameRate: framerate,
            repeat: -1,
            yoyo: true
        });


        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNumbers('objects', { start: 0, end: 5 }),
            frameRate: 4,
            repeat: -1
        })
    }
}