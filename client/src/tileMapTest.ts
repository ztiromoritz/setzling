import {TileMap} from "./tileMap";
import {PixiResources} from "./assets";
import * as PIXI from 'pixi.js';
import * as alea from 'alea';
import * as Perlin from 'perlin.js';


Perlin.seed(1);


export function testMap(app: PIXI.Application, resources: PixiResources){
    function tileCallback(tileX: number, tileY: number): number {
        const perlin = Perlin.simplex2(tileX, tileY);

        const rndInt = Math.floor(Math.abs(perlin * 20));
        console.log(perlin, rndInt);
        return Math.max(rndInt-17,0);
    }
    const tileMap = new TileMap({
        tileCallback,
        tileHeight: 16,
        tileWidth: 16,
        tileset: resources.tileset.texture
    });
    
    
    const mapTexture = PIXI.RenderTexture.create({width:1200, height: 800});
    tileMap.renderToTexture(mapTexture, new PIXI.Rectangle(8,8, 1200, 800));
    const mapSprite = new PIXI.Sprite(mapTexture);
    app.stage.addChild(mapSprite);

}