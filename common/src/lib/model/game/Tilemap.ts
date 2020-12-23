

export interface Tilemap {
  objects : MapObject[]
  layers: MapLayer[],
}

export interface MapLayer {
  tileWidth: number,
  tileHeight: number,
  data: number [][],
  tileset: Tileset, // one tileset per layer
}

export interface Tileset {
  id : number,
  imageId: string,
  tiles : Tile[]
}

// Metadata for every tile in the TileSet
export interface Tile {
  id: number,
  properties: {
    [key: string]: string | number | boolean
  }
}

export type TemplateId = string;
export type MapObjectId = string;

export interface Template {
    id: TemplateId;
    image: string;
}

export interface MapObject {
  id: MapObjectId,
  template: TemplateId,
  position : {
    // pixel coords, not grid index
    x: number, y: number
  }
}
