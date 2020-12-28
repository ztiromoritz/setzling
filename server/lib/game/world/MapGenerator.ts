import {MapLayer, Tilemap, Tileset} from "setzling-common";
import Perlin from "perlin.js";

const TILEMAP_WIDTH = 16;
const mapGeneration = {
    emptyChance: 80, // % of a tile having no content
    tileTypes: {
        grass: {
            row: 0,     // the row of this tiletype in the sprite sheet
            tiles: 6,   // how many tiles are in use
            chance: 65  // % of this tile type being the content
        },
        rocks: {
            row: 1,
            tiles: 3,
            chance: 20
        },
        flowers: {
            row: 2,
            tiles: 4,
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


export function createFloorLayer(width: number, height: number) : MapLayer {
    const debugMetrics: number[] = [];
    const mapData: number[][] = [];
    for(let iy=0;iy<height;iy++){
        const row: number[] = [];
        mapData.push(row);
        for(let ix=0;ix<width;ix++){
            let spriteIndex = randomSpriteIndex(ix,iy);
            if (!debugMetrics[spriteIndex]) {debugMetrics[spriteIndex] = 0}
            debugMetrics[spriteIndex] += 1;
            row.push(spriteIndex);
        }
    }

    // TODO: currently not used/ could may be used to generate the mapGeneration object
    const tileset:Tileset = {id: 0, imageId: 'todo', tiles:[]};
    return { tileHeight: 16, tileWidth: 16, data: mapData, tileset}
}



export class MapGenerator {

    static generateRandomMap(width:number,height:number): Tilemap {
        const floorLayer = createFloorLayer(width, height);
        return {
            layers: [floorLayer],
            objects: {}
        };
    }
}