import React from 'react'
import { IconBaseProps, IconType } from 'react-icons'
import { GiGlock, GiMachineGunMagazine, GiStunGrenade } from 'react-icons/gi'
import { IoShirtSharp, IoBag, IoHelp } from 'react-icons/io5'
import { RiLayoutGridFill } from 'react-icons/ri'

import { Item } from './definitions'

// Not the best way to handle icons really - would prefer to just use strings & classNames
// but react-icons doesn't really support that -- and would rather not include ReactNodes
// in the constants.ts/definitions.ts files.

// TODO: better colours

const maps: { [key: string]: { icon: IconType; accent: string } } = {
  all: { icon: RiLayoutGridFill, accent: '' },
  weapon: { icon: GiGlock, accent: 'blue' },
  ammo: { icon: GiMachineGunMagazine, accent: 'green' },
  grenade: { icon: GiStunGrenade, accent: 'red' },
  gear: { icon: IoShirtSharp, accent: 'purple' },
  storage: { icon: IoBag, accent: 'orange' },
}

export const getItemInfo = (
  value: Item | string
): { icon: (iconProps?: IconBaseProps) => React.ReactNode; accent: string } => {
  const tags = typeof value === 'string' ? [value] : [value.type, ...value.tags]

  let result

  // Check against different object properties if {value} is an Item
  tags.some(tag => {
    let exists = maps[tag]
    if (!!exists)
      result = { ...exists, icon: (iconProps?: IconBaseProps) => <exists.icon {...iconProps} /> }
    return !!exists
  })

  if (!result) {
    result = { icon: (iconProps?: IconBaseProps) => <IoHelp {...iconProps} />, accent: 'red' }
  }

  return result
}
