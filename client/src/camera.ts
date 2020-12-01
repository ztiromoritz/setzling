export type XCam = number;
export type YCam = number;
export type XWorld = number;
export type YWorld = number;
export type XScreen = number;
export type YScreen = number;


// Position on the games canvas
export type ScreenCoords = {x: XScreen, y:YScreen};

// Position on the cameras Viewport.
export type CamCoords = { x: XCam, y: YCam };

// Position on the World
export type WorldCoords = { x: XWorld, y: YWorld };

export type CameraOptions = {
    width: number,
    height: number,
    positionOnScreen: ScreenCoords,
    positionInWorld: WorldCoords
}


// scale 1:1
export class Camera {
    private width: number;
    private height: number;
    private halfWidth: number;
    private halfHeight: number;


    private positionOnScreen: ScreenCoords;
    private positionInWorld: WorldCoords;


    constructor(options : CameraOptions) {
        this.width = options.width;
        this.height = options.height;
        this.halfWidth = Math.floor(this.width / 2);
        this.halfHeight = Math.floor(this.height / 2);
        this.positionOnScreen = {...options.positionOnScreen};
        this.positionInWorld = {...options.positionInWorld};
    }

    setDimension({width, height}: { width: number, height: number }) {
        this.width = width;
        this.height = height;
        this.halfWidth = Math.floor(this.width / 2);
        this.halfHeight = Math.floor(this.height / 2);
    }

    setPositionInWorld(position: WorldCoords){
        this.positionInWorld = {...position};
    }

    setPositionOnScreen(position: ScreenCoords){
        this.positionOnScreen = {...position};
    }

    centerOn(world: WorldCoords) {
        const x = world.x - this.halfWidth;
        const y = world.y - this.halfHeight;
        this.setPositionInWorld({x, y});
    }

    camXYtoWorldXY(cam: CamCoords): WorldCoords {
        return {
            x: this.positionInWorld.x + cam.x,
            y: this.positionInWorld.y + cam.y,
        };
    }

    worldXYIsVisible(world: WorldCoords): boolean {
        const cam: CamCoords = this.worldXYToCamXY(world);
        return !(cam.x < 0 || cam.x >= this.width || cam.y < 0 || cam.y >= this.height);
    }

    worldXYToCamXY(world: WorldCoords): CamCoords {
        return {
            x: world.x - this.positionInWorld.x,
            y: world.y - this.positionInWorld.y,
        }
    }

    worldXYToScreenXY(world: WorldCoords): ScreenCoords {
        const camCoords = this.worldXYToCamXY(world);
        return {
            x: camCoords.x + this.positionOnScreen.x,
            y: camCoords.y + this.positionOnScreen.y
        }
    }


    getScreenRect(): {width: number, height: number, position: ScreenCoords} {
        return {
            position : {...this.positionOnScreen},
            width: this.width,
            height: this.height
        }
    }

    getWorldRect(){
        return {
            position: {...this.positionInWorld},
            width: this.width,
            height: this.height
        }
    }

}