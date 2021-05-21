import { useTransition, animated } from 'react-spring'

import { EquipSlot } from '../Equip'
import { EquipSlotType } from '../../data/definitions'

//////////////////////////
// Component definition //
//////////////////////////
export const PlayerGear = () => {
  const transitions = useTransition(true, {
    from: { opacity: 0, left: -30 },
    enter: { opacity: 1, left: 0 },
  })

  return transitions((transitionStyle: any) => (
    <animated.div id="gear" className="panel" style={transitionStyle}>
      <div className="panel-title">GEAR</div>

      <div className="slots">
        <div className="slots-row head">
          <EquipSlot label="HEADSET" type={EquipSlotType.HEADSET} />
          <EquipSlot label="GOGGLES" type={EquipSlotType.GOGGLES} />
          <EquipSlot label="HELMET" type={EquipSlotType.HELMET} />
        </div>

        <div className="slots-row body">
          <EquipSlot label="ARMOR" type={EquipSlotType.ARMOR} />
        </div>

        <div className="slots-row weapons">
          <EquipSlot label="ON SLING" type={EquipSlotType.SLING} dimensions={{ w: 5, h: 2 }} />
          <EquipSlot label="HOLSTER" type={EquipSlotType.HOLSTER} />
        </div>

        <div className="slots-row weapons">
          <EquipSlot label="ON BACK" type={EquipSlotType.BACK} dimensions={{ w: 5, h: 2 }} />
          <EquipSlot label="SCABBARD" type={EquipSlotType.SCABBARD} />
        </div>
      </div>

      <style jsx global>{`
        #gear {
          .slots {
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            width: 100%;
            overflow-y: auto;
            padding: 1px 1rem 1px 1px;

            .slots-row {
              display: flex;
              flex-flow: row nowrap;
              justify-content: space-between;
              width: 100%;
              margin-bottom: 1.5rem;

              &:last-child {
                margin-bottom: 0;
              }

              &.body {
                justify-content: center;
              }

              & > :global(.equip-slot-container) {
                margin-right: 1.5rem;

                &:last-child {
                  margin-right: 0;
                }
              }
            }
          }
        }
      `}</style>
    </animated.div>
  ))
}
