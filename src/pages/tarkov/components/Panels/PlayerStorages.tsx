import { useTransition, animated } from 'react-spring'

import { Grid } from '../Grid'
import { EquipHeader, EquipSlot } from '../Equip'
import { EquipSlotType } from '../../data/definitions'

//////////////////////////
// Component definition //
//////////////////////////
export const PlayerStorages = () => {
  const transitions = useTransition(true, {
    from: { opacity: 0, bottom: -30 },
    enter: { opacity: 1, bottom: 0 },
  })

  return transitions((transitionStyle: any) => (
    <animated.div id="storages" className="panel" style={transitionStyle}>
      <div className="panel-title">STORAGES</div>

      <div className="slots">
        <EquipSlot label="CHEST RIG" type={EquipSlotType.RIG} />

        <EquipHeader label="POCKETS" />
        <div id="pockets">
          <Grid id="grid-pocket-1" cols={1} rows={1} />
          <Grid id="grid-pocket-2" cols={1} rows={1} />
          <Grid id="grid-pocket-3" cols={1} rows={1} />
          <Grid id="grid-pocket-4" cols={1} rows={1} />
        </div>

        <EquipSlot label="BACKPACK" type={EquipSlotType.BACKPACK} />

        <EquipSlot label="POUCH" type={EquipSlotType.POUCH} />
      </div>

      <style jsx global>{`
        #storages {
          flex: 1;

          .slots {
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            width: 100%;
            overflow-y: auto;
            padding: 1px 1rem 1px 1px;

            #pockets {
              display: flex;
              flex-flow: row nowrap;
              margin-top: 1px;
              margin-bottom: 1.5rem;

              & > :global(.grid-container) {
                margin-right: 3px;

                &:last-child {
                  margin-right: 0px;
                }
              }
            }

            & > :global(.equip-slot) {
              margin-bottom: 1.5rem;

              &:last-child {
                margin-bottom: 1px;
              }
            }
          }
        }
      `}</style>
    </animated.div>
  ))
}
