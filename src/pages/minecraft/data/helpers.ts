import items from './items.json'
import { ItemsConfig, Item, SlotType } from './definitions'

import { getState } from '@zus/minecraft/store'

const itemsConfig = items as ItemsConfig

export const getItemInfo = (value: Item | string | null) => {
  if (!value) return null

  // Provided {value} is of type string (assume it's the iid)
  if (typeof value === 'string') {
    let info = itemsConfig[value]
    if (!info) return null
    return { iid: value, quantity: 0, ...info }
  }

  // Provided {value} is of type Item
  else if (value.iid) {
    let info = itemsConfig[value.iid]
    if (!info) return null
    return { ...value, ...info }
  }

  // Invalid {value}
  else {
    return null
  }
}

export const getInventorySlot = (type: SlotType, index: number) => {
  const item = getState().slots[type][index]

  return { item: getItemInfo(item), slot: { type, index } }
}
