import { DEFAULT_GRID_SIZE } from '../../data/constants'

export interface EquipHeaderProps {
  label: string
}

export const EquipHeader = (props: EquipHeaderProps) => {
  return (
    <div className="equip-header">
      {props.label}

      <style jsx>{`
        $height: 18px;
        $header-background-color: #373736;

        .equip-header {
          position: relative;
          width: calc(${DEFAULT_GRID_SIZE}px * 2 - #{$height});
          height: $height;
          line-height: $height;
          flex-shrink: 0;
          display: flex;
          flex-flow: row nowrap;
          background: $header-background-color;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0 0 0 0.25rem;
          user-select: none;

          &:after {
            content: '';
            position: absolute;
            top: 0;
            right: -$height;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: $height 0 0 $height;
            border-color: transparent transparent transparent $header-background-color;
          }
        }
      `}</style>
    </div>
  )
}
