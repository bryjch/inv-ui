export enum SlotType {
  BACKPACK = 'backpack',
  HOTBAR = 'hotbar',
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
