import { Scene } from "phaser";
import { ItemInstance, ITEM_ACORN } from "setzling-common";
import { ClientItemDescriptor } from "../clientItem";
import { ClientItemRegistry } from "../clientRegistry";

class AcornSprite extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'objects', 16);
        this.setOrigin(0, 0);
    }
}

const item: ClientItemDescriptor = {
    createPlacedSprite(scene: Scene, itemInstance: ItemInstance) {
        const { x, y } = itemInstance.position || { x: 0, y: 0 };
        return new AcornSprite(scene, x, y)
    }
};

ClientItemRegistry.register(ITEM_ACORN, item);