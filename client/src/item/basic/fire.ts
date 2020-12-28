import { Scene } from "phaser";
import { ITEM_FIRE } from "setzling-common";
import { ItemInstance } from "setzling-common/build/module";
import { ClientItemDescriptor } from "../clientItem";
import { ClientItemRegistry } from "../clientRegistry";


class FireSprite extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'objects', 0);
        this.setOrigin(0, 0);
        const animationManager = this.anims.animationManager;
        animationManager.create({
            key: 'fire',
            frames: animationManager.generateFrameNumbers('objects', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
        const fireAnmation = animationManager.get("fire");
        this.anims.play(fireAnmation);
    }

    update(){
        
    }
}

const item: ClientItemDescriptor = {
    createPlacedSprite(scene: Scene, itemInstance: ItemInstance) {
        const { x, y } = itemInstance.position || { x: 0, y: 0 };
        return new FireSprite(scene, x, y)
    }
};

ClientItemRegistry.register(ITEM_FIRE, item);