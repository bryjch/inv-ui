import { ItemPreview } from '../ItemPreview'

import { Item } from '../../data/definitions'

export interface BriefcaseItemProps {
  item: Item
}

export const BriefcaseItem = ({ item }: BriefcaseItemProps) => {
  return (
    <div className="briefcase-item">
      <ItemPreview item={item} fluid showGrid={false} />

      <style jsx>{`
        .briefcase-item {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 100;
          pointer-events: none;
          background: var(--briefcase-item-background-color);
          outline: 3px solid var(--briefcase-item-outline-color);
          outline-offset: -4px;
        }
      `}</style>

      <style jsx>{`
        .briefcase-item {
          width: calc(100% * (${item?.dimensions?.w || 1}));
          height: calc(100% * (${item?.dimensions?.h || 1}));
        }
      `}</style>
    </div>
  )
}
