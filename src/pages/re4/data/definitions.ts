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

export enum DropType {
  Briefcase = 'briefcase',
  Storage = 'storage',
}

export interface Dimensions {
  w: number
  h: number
}
