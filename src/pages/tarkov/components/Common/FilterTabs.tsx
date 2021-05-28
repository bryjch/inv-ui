import { GiGlock, GiMachineGunMagazine, GiStunGrenade } from 'react-icons/gi'
import { IoShirtSharp, IoBag } from 'react-icons/io5'
import { RiLayoutGridFill } from 'react-icons/ri'

import { useControlledState } from '@utils/hooks'

export type FilterTabOption = {
  label: string
  value: string
  icon: React.ReactNode
}

export const FilterTabOptions: FilterTabOption[] = [
  { label: 'All', value: 'all', icon: <RiLayoutGridFill color="#ffffff" size={16} /> },
  { label: 'Weapons', value: 'weapon', icon: <GiGlock color="#ffffff" size={20} /> },
  { label: 'Ammo', value: 'ammo', icon: <GiMachineGunMagazine color="#ffffff" size={20} /> },
  { label: 'Grenades', value: 'grenade', icon: <GiStunGrenade color="#ffffff" size={20} /> },
  { label: 'Gear', value: 'gear', icon: <IoShirtSharp color="#ffffff" size={20} /> },
  { label: 'Storages', value: 'storage', icon: <IoBag color="#ffffff" size={20} /> },
]

export type FilterTabsProps = {
  value?: FilterTabOption
  onChange?: (filter: FilterTabOption) => void
}

//////////////////////////
// Component definition //
//////////////////////////
export const FilterTabs = (props: FilterTabsProps) => {
  const [activeFilter, setActiveFilter] = useControlledState(
    props.value,
    props.onChange,
    FilterTabOptions[0]
  )

  return (
    <div className="filter-tabs">
      {FilterTabOptions.map(filter => (
        <div
          key={`filter-${filter.value}`}
          title={filter.label}
          className={`filter ${activeFilter.value === filter.value ? 'active' : ''}`}
          onClick={() => setActiveFilter(filter)}
        >
          {filter.icon || filter.label}
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
