import {TileMap} from "./tileMap";
import {PixiResources} from "./assets";
import * as PIXI from 'pixi.js';
import * as Perlin from 'perlin.js';
import {Camera} from "./camera";


Perlin.seed(1);


export function testMap(app: PIXI.Application, resources: PixiResources, camera:Camera){

    function tileCallback(tileX: number, tileY: number): number {
        const perlin = Perlin.simplex2(tileX, tileY);
        const rndInt = Math.floor(Math.abs(perlin * 20));
        return Math.max(rndInt-17,0);
    }

    const tileMap = new TileMap({
        tileCallback,
        tileHeight: 16,
        tileWidth: 16,
        tileset: resources.tileset?.texture
    });

    const camScreenRect = camera.getScreenRect();
    const mapTexture = PIXI.RenderTexture.create({width: camScreenRect.width, height: camScreenRect.height});
    const mapSprite = new PIXI.Sprite(mapTexture);
    app.stage.addChild(mapSprite);

    return {
        update(){
            mapSprite.x = camera.getScreenRect().position.x;
            mapSprite.y = camera.getScreenRect().position.y;

            const {position,width, height} = camera.getWorldRect();
           // console.log(camera.getWorldRect());
            tileMap.renderToTexture(mapTexture, new PIXI.Rectangle(position.x,position.y,width,height));
            mapSprite.texture.update();
        }
    }

}