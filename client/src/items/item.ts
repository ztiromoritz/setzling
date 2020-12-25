export interface Item {
    id: string,
    displayName: string,
    description: string,
    
    // icon: string (how to address this with sprite sheet.)

    // Can be placed on the map grid if blueprint or instance is in inventory 
    placeable: boolean

    // Can be picked up if instance is placed on map
    pickable: boolean

    // Can be stacked in inventory
    stackable: boolean

    // Opportunities when instance or stack is held in inventory
    // ItemConsts.IN_HAND.NONE
    //      Not usable in hand
    // ItemConsts.IN_HAND.USABLE
    //      Can be used, when in hand. Item is not consumed.
    // ItemConsts.IN_HAND.CONSUMABLE
    //      Can be consumed. Disapers or stack size decreases when used.
    inHand: number

    // Opportunities when instance is placed on map
    // ItemConsts.IN_HAND.NONE
    //      Not usable if placed on map.
    // ItemConsts.IN_HAND.USABLE
    //      Can be used, when on map. Item is not consumed.
    // ItemConsts.IN_HAND.CONSUMABLE
    //      Can be consumed. Disapers when used.
    inPlace: number

    createInventoryBluprintSprite: () => Phaser.GameObjects.Sprite
    
    // TODO: Wording an GameState angleichen
    //createInventorySprite: (instanceState: ItemInstanceState) => Phaser.GameObjects.Sprite
    //createPlacedSprite: (instanceState: ItemInstanceState) => Phaser.GameObjects.Sprite


    onPlace:()=>void
    onPickup:()=>void
    onUseInHand: ()=>void
    onUseOnPlace: ()=>void

}

export const ItemConsts = {
    IN_HAND: {
        NONE: 0,
        USABLE: 1,
        CONSUMABLE: 2
    },
    IN_PLACE: {
        NONE: 0,
        USABLE: 1,
        CONSUMABLE: 2
    }
}