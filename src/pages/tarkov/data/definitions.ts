export interface ItemConfig {
  iid: string
  displayName: string
  tags: string[]
  ammoTypes: string[]
  dimensions: Dimensions
  spriteOffset: [number, number]
}

export interface Item extends ItemConfig {
  position?: number
  uuid: string
}

export interface ItemGrid {
  area: Dimensions
  items: Item[]
  occupied: number[]
}

export interface XYCoord {
  x: number
  y: number
}

export interface Dimensions {
  w: number
  h: number
}
