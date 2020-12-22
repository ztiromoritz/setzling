export interface Tilemap {
  objects : []
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
