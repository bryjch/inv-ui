export enum SlotType {
  BACKPACK = 'backpack',
  HOTBAR = 'hotbar',
}

export interface Slot {
  type: SlotType
  index: number
  item: Item | null
}

export interface Item {
  iid: string
  quantity: number
}

export interface ItemsConfig {
  [iid: string]: {
    stackable: boolean
    stackQuantity: number
    displayName: string
    image: string
  }
}
