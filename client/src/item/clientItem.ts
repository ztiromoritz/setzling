import { Scene } from "phaser";
import { Item, ItemInstance } from "setzling-common";

export interface ClientItemDescriptor {
    createInventoryBluprintSprite?: (scene: Scene, instance: ItemInstance) => Phaser.GameObjects.Sprite
    
    // TODO: Wording an GameState angleichen
    createInventorySprite?: (scene: Scene, instance: ItemInstance) => Phaser.GameObjects.Sprite
    createPlacedSprite?: (scene: Scene, instance: ItemInstance) => Phaser.GameObjects.Sprite

    onPlace?:()=>void
    onPickup?:()=>void
    onUseInHand?: ()=>void
    onUseOnPlace?: ()=>void
}

export interface ClientItem extends ClientItemDescriptor, Item {
    // TODO default Implementations  
}

