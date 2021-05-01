import { StorageItem } from './StorageItem'

import { Item } from '../../data/definitions'

const DUMMY_ITEMS: Item[] = [
  new Item('Shotgun', 1, 5, 2),
  new Item('Pistol', 1, 2, 2),
  new Item('HE Grenade', 1, 1, 2),
  new Item('Rifle', 1, 2, 4),
]

export const Storage = () => {
  return (
    <div id="storage">
      {DUMMY_ITEMS.map((item, index) => (
        <StorageItem item={item} key={`storage-item-${index}`} />
      ))}

      <style jsx>{`
        #storage {
          background: #fff;
          max-height: 600px;
          overflow-y: auto;
          margin-left: 1rem;
        }
      `}</style>
    </div>
  )
}

export default Storage
