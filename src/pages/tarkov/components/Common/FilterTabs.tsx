import { ITEM_FILTER_OPTIONS } from '../../data/constants'
import { ItemFilterOption } from '../../data/definitions'
import { getItemInfo } from '../../data/mappings'

import { useControlledState } from '@utils/hooks'

export type FilterTabsProps = {
  value?: ItemFilterOption
  onChange?: (filter: ItemFilterOption) => void
}

//////////////////////////
// Component definition //
//////////////////////////
export const FilterTabs = (props: FilterTabsProps) => {
  const [activeFilter, setActiveFilter] = useControlledState(
    props.value,
    props.onChange,
    ITEM_FILTER_OPTIONS[0]
  )

  return (
    <div className="filter-tabs">
      {ITEM_FILTER_OPTIONS.map(filter => (
        <div
          key={`filter-${filter.value}`}
          title={filter.label}
          className={`filter ${activeFilter.value === filter.value ? 'active' : ''}`}
          onClick={() => setActiveFilter(filter)}
        >
          {getItemInfo(filter.value).icon({ size: 20 })}
        </div>
      ))}

      <style jsx global>{`
        $filter-button-size: 30px;
        $filter-button-color: rgba(150, 150, 150, 1);
        $filter-cutout-size: 6px;

        .filter-tabs {
          display: flex;
          flex-flow: column;
          align-items: flex-end;
          flex-shrink: 0;
          width: #{$filter-button-size + 2px}; // Account for .filter margin-right

          .filter {
            position: relative;
            width: #{$filter-button-size - $filter-cutout-size};
            height: #{$filter-button-size};
            line-height: #{$filter-button-size};
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #{$filter-button-color};
            padding-right: #{$filter-cutout-size};
            margin-right: 2px;
            margin-bottom: 2px;
            cursor: pointer;
            font-weight: 900;
            color: #ffffff;
            opacity: 0.5;
            transition: 0.1s ease opacity;

            &:before {
              content: '';
              position: absolute;
              left: -#{$filter-cutout-size};
              top: #{$filter-cutout-size};
              bottom: 0;
              width: #{$filter-cutout-size};
              background: #{$filter-button-color};
            }

            &:after {
              content: '';
              position: absolute;
              top: 0px;
              left: -#{$filter-cutout-size};
              border-color: transparent;
              border-style: solid;
              border-width: #{$filter-cutout-size / 2};
              border-right-color: #{$filter-button-color};
              border-bottom-color: #{$filter-button-color};
            }

            & > :global(svg) {
              flex-shrink: 0;
            }

            &:hover {
              opacity: 0.75;
            }

            &.active {
              opacity: 1;
              margin-right: 0;
              z-index: 1;
            }
          }
        }
      `}</style>
    </div>
  )
}
