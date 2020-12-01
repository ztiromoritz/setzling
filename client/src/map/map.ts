import Perlin from "perlin.js";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

function randomTile(tileX: number, tileY: number): number {
    const perlin = Perlin.simplex2(tileX, tileY);
    const rndInt = Math.floor(Math.abs(perlin * 20));
    return Math.max(rndInt-17,0);
}


export function createFloorLayer(scene: Phaser.Scene,width: number, height: number): DynamicTilemapLayer {
    const mapData: number[][] = [];
    for(let y=0;y<width;y++){
        const row: number[] = [];
        mapData.push(row);
        for(let x=0;x<width;x++){
            row.push(randomTile(x,y));
        }
    }
    const map = scene.make.tilemap({ data: mapData, tileWidth: 16, tileHeight: 16 });
    const tiles = map.addTilesetImage("tileset");
    const layer = map.createDynamicLayer(0, tiles, 0, 0);
    return layer;
}