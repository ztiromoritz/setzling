import {createFrames, mainRenderer} from "./pixi-helper";
import * as PIXI from 'pixi.js';

const renderer = PIXI.autoDetectRenderer();


type MapOptions = {
    tileWidth: number,
    tileHeight: number,
    tileset?: PIXI.Texture,
    tileCallback: (tileX: number, tileY: number) => number
};

export class TileMap {
    private tileWidth: number;
    private tileHeight: number;
    private tiles: PIXI.Texture[];
    private sprites: PIXI.Sprite[];
    private tileCallback: ((tileX: number, tileY: number) => number);

    constructor({tileWidth, tileHeight, tileset, tileCallback}: MapOptions) {
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        console.log("tileset ",tileset);
        this.tiles = [];
        if(tileset){
            this.tiles = createFrames(tileset, {frameWidth: tileWidth, frameHeight: tileHeight});
        }
        this.sprites = this.tiles.map((texture) => new PIXI.Sprite(texture));
        this.tileCallback = tileCallback
    }

    renderToTexture(renderTexture: PIXI.RenderTexture, worldRect: PIXI.Rectangle) {
        if (renderTexture) {
            const tileLeft = Math.floor(worldRect.left / this.tileWidth);
            const xOffset = worldRect.left % this.tileWidth;
            const cols = Math.floor(worldRect.width / this.tileWidth);

            const tileTop = Math.floor(worldRect.top / this.tileHeight);
            const yOffset = worldRect.top % this.tileHeight;
            const rows = Math.floor(worldRect.height / this.tileHeight);

            for (let tileX = tileLeft; tileX < tileLeft + cols; tileX++) {
                for (let tileY = tileTop; tileY < tileTop + rows; tileY++) {
                    const tileIndex = this.tileCallback(tileX, tileY);
                    // console.log("tileIndex "+tileIndex);
                    //const sprite =  PIXI.Sprite.from('./assets/setzling.png');
                    const sprite = new PIXI.Sprite(this.tiles[tileIndex]);
                    sprite.x = xOffset + (tileX - tileLeft) * this.tileWidth;
                    sprite.y = yOffset + (tileY - tileTop) * this.tileHeight;
                    sprite.setTransform(xOffset + (tileX - tileLeft) * this.tileWidth, yOffset + (tileY - tileTop) * this.tileHeight )
                   // console.log("spritex " + sprite.x + " sprite.y " + sprite.y)
                    mainRenderer.render(sprite, renderTexture, false);
                }
            }
        }
    }


}