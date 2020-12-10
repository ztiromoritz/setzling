import Perlin from "perlin.js";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

const TILEMAP_WIDTH = 16;
const mapGeneration = {
    emptyChance: 90, // % of a tile having no content
    tileTypes: {
        grass: {
            row: 0,     // the row of this tiletype in the sprite sheet
            tiles: 5,   // how many tiles are in use
            chance: 60  // % of this tile type being the content
        },
        rocks: {
            row: 1,
            tiles: 2,
            chance: 25
        },
        flowers: {
            row: 2,
            tiles: 3,
            chance: 15
        }
    }
}

function chooseTileType(rnd: number): number {
    for (let tileType in mapGeneration.tileTypes) {
        // @ts-ignore
        let type = mapGeneration.tileTypes[tileType];
        if (rnd <= type.chance) {
            return (rnd % type.tiles)+1 + (type.row * TILEMAP_WIDTH)
        } else (rnd -= type.chance);
    }
    return 0; // fallback to empty tile
}

function randomSpriteIndex(tileX: number, tileY: number): number {
    const perlin = Perlin.simplex2(tileX, tileY);
    let rndInt = Math.floor(Math.abs(perlin * 100));
    if (rndInt > mapGeneration.emptyChance) {
        rndInt = Math.floor((Math.abs(perlin * 100)-80) * 5); // re-scale to 100%
        return chooseTileType(rndInt);
    } else
        return 0; // fallback to empty tile
}


export function createFloorLayer(scene: Phaser.Scene,width: number, height: number): DynamicTilemapLayer {
    const debugMetrics: number[] = [];
    const mapData: number[][] = [];
    for(let iy=0;iy<width;iy++){
        const row: number[] = [];
        mapData.push(row);
        for(let ix=0;ix<width;ix++){
            let spriteIndex = randomSpriteIndex(ix,iy);
            if (!debugMetrics[spriteIndex]) {debugMetrics[spriteIndex] = 0}
            debugMetrics[spriteIndex] += 1;
            row.push(spriteIndex);
        }
    }
    console.log("Debug metric for generated map: "+debugMetrics);
    const map = scene.make.tilemap({ data: mapData, tileWidth: TILEMAP_WIDTH, tileHeight: 16 });
    const tiles = map.addTilesetImage("tileset");
    const layer = map.createDynamicLayer(0, tiles, 0, 0);
    return layer;
}