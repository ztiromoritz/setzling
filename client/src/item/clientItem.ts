import { Item, ItemInstanceState } from "setzling-common";

export interface ClientItemDescriptor {
    createInventoryBluprintSprite: (instanceState: ItemInstanceState) => Phaser.GameObjects.Sprite
    
    // TODO: Wording an GameState angleichen
    createInventorySprite: (instanceState: ItemInstanceState) => Phaser.GameObjects.Sprite
    createPlacedSprite: (instanceState: ItemInstanceState) => Phaser.GameObjects.Sprite

    onPlace?:()=>void
    onPickup?:()=>void
    onUseInHand?: ()=>void
    onUseOnPlace?: ()=>void
}

export interface ClientItem extends ClientItemDescriptor, Item {
    
}

