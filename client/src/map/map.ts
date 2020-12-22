import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import {MapLayer} from "setzling-common";

export function createFloorLayer(scene: Phaser.Scene, mapLayer: MapLayer): DynamicTilemapLayer {
    const {data, tileWidth, tileHeight} = mapLayer;
    const map = scene.make.tilemap({data, tileWidth, tileHeight});
    const tiles = map.addTilesetImage("tileset");
    const layer = map.createDynamicLayer(0, tiles, 0, 0);
    return layer;
}