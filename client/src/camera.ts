export type XCam = number;
export type YCam = number;
export type XWorld = number;
export type YWorld = number;

export type CamCoords = { x: XCam, y: YCam };
export type WorldCoords = { x: XWorld, y: YWorld };

// scale 1:1
export class Camera {
    private width: number;
    private height: number;
    private topWorld: number;
    private leftWorld: number;
    private halfWidth: number;
    private halfHeight: number;

    constructor({width, height, leftWorld, topWorld}: { width: number, height: number, leftWorld: number, topWorld: number }) {
        this.leftWorld = leftWorld;
        this.topWorld = topWorld;
        this.width = width;
        this.height = height;
        this.halfWidth = Math.floor(this.width / 2);
        this.halfHeight = Math.floor(this.height / 2);
    }

    move({leftWorld, topWorld}: { leftWorld: number, topWorld: number }) {
        this.leftWorld = leftWorld;
        this.topWorld = topWorld;
    }

    setDimension({width, height}: { width: number, height: number }) {
        this.width = width;
        this.height = height;
        this.halfWidth = Math.floor(this.width / 2);
        this.halfHeight = Math.floor(this.height / 2);
    }


    centerOn(world: WorldCoords) {
        const leftWorld = world.x - this.halfWidth;
        const topWorld = world.y - this.halfHeight;
        this.move({leftWorld, topWorld})
    }

    camXYtoWorldXY(cam: CamCoords): WorldCoords {
        return {
            x: this.leftWorld + cam.x,
            y: this.topWorld + cam.y,
        };
    }

    worldXYIsVisible(world: WorldCoords): boolean {
        const cam: CamCoords = this.worldXYToCamXY(world);
        return !(cam.x < 0 || cam.x >= this.width || cam.y < 0 || cam.y >= this.height);
    }

    worldXYToCamXY(world: WorldCoords): CamCoords {
        return {
            x: world.x - this.leftWorld,
            y: world.y - this.topWorld,
        }
    }

    getWorldRect(){
        return {
            x: this.leftWorld,
            y: this.topWorld,
            width: this.width,
            height: this.height
        }
    }

}