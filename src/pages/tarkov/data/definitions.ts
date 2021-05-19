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

export enum EquipSlotType {
  HEADSET = 'headset',
  GOGGLES = 'goggles',
  HELMET = 'helmet',
  ARMOR = 'armor',
  SLING = 'sling',
  BACK = 'back',
  HOLSTER = 'holster',
  SCABBARD = 'scabbard',
  RIG = 'rig',
  POCKETS = 'pockets',
  BACKPACK = 'backpack',
  POUCH = 'pouch',
}
