import { Fallout } from '@pages/fallout'
import { Minecraft } from '@pages/minecraft'

import { Game } from '@shared/data/definitions'

export const GITHUB = {
  PROJECT_URL: 'https://github.com/bryjch/inv-ui',
  AUTHOR_URL: 'https://github.com/bryjch',
}

export const GAMES: Game[] = [
  {
    id: 'fallout',
    name: 'Fallout',
    image: '/assets/misc/images/fallout.png',
    component: Fallout,
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    image: '/assets/misc/images/minecraft.png',
    component: Minecraft,
  },
]
