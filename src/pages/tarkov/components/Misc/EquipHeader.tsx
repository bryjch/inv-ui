import { DEFAULT_GRID_SIZE } from '../../data/constants'

export interface EquipHeaderProps {
  label: string
}

export const EquipHeader = (props: EquipHeaderProps) => {
  return (
    <div className="equip-header">
      {props.label}

      <style jsx>{`
        $background-color: #969696;
        $height: 14px;

        .equip-header {
          position: relative;
          width: calc(${DEFAULT_GRID_SIZE}px * 2 - #{$height});
          height: $height;
          line-height: $height;
          flex-shrink: 0;
          background: $background-color;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0 0.2rem;

          &:after {
            content: '';
            position: absolute;
            top: 0;
            right: -$height;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: $height 0 0 $height;
            border-color: transparent transparent transparent $background-color;
          }
        }
      `}</style>
    </div>
  )
}
