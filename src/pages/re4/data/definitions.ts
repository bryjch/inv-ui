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
}

export interface ItemGrid {
  area: GridArea
  items: Item[]
  occupied: number[]
}

export interface Dimensions {
  w: number
  h: number
}

export interface GridArea {
  cols: number
  rows: number
}
