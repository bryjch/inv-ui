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
          <EquipSlot label="EYEWEAR" type={EquipSlotType.EYEWEAR} />
          <EquipSlot label="HELMET" type={EquipSlotType.HELMET} />
        </div>

        <div className="slots-row body">
          <EquipSlot label="ARMOR" type={EquipSlotType.ARMOR} />
        </div>

        <div className="slots-row weapons">
          <EquipSlot
            label="ON SLING"
            type={EquipSlotType.WEAPON_PRIMARY}
            dimensions={{ w: 5, h: 2 }}
          />
          <EquipSlot label="HOLSTER" type={EquipSlotType.WEAPON_SIDEARM} />
        </div>

        <div className="slots-row weapons">
          <EquipSlot
            label="ON BACK"
            type={EquipSlotType.WEAPON_SECONDARY}
            dimensions={{ w: 5, h: 2 }}
          />
          <EquipSlot label="SCABBARD" type={EquipSlotType.WEAPON_MELEE} />
        </div>
      </div>

      <style jsx global>{`
        #gear {
          .slots {
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            width: 100%;
            height: 100%;
            overflow-y: auto;
            padding: 1px;

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
