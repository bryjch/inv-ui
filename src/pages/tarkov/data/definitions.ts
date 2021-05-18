export interface ItemConfig {
  type: string
  iid: string
  shortName: string
  longName: string
  tags: string[]
  dimensions: Dimensions
  spriteOffset: [number, number]
  ammoTypes?: string[]
  slots?: [number[]]
}

export interface Item extends ItemConfig {
  position?: number
  rotated: boolean
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
