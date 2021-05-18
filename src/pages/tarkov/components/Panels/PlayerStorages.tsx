import { useTransition, animated } from 'react-spring'

import { Grid } from '../Grid'
import { EquipHeader, EquipSlot } from '../Equip'

export interface PlayerStoragesProps {
  areaMethods: { [key: string]: (...args: any[]) => any }
}

export const PlayerStorages = (props: PlayerStoragesProps) => {
  const transitions = useTransition(true, {
    from: { opacity: 0, bottom: -30 },
    enter: { opacity: 1, bottom: 0 },
  })

  return transitions((transitionStyle: any) => (
    <animated.div id="storages" className="panel" style={transitionStyle}>
      <div className="panel-title">STORAGES</div>

      <div className="slots">
        <EquipSlot id="rig" label="CHEST RIG" areaMethods={props.areaMethods} />

        <EquipHeader label="POCKETS" />
        <div id="pockets">
          <Grid id="grid-pocket-1" cols={1} rows={1} {...props.areaMethods} />
          <Grid id="grid-pocket-2" cols={1} rows={1} {...props.areaMethods} />
          <Grid id="grid-pocket-3" cols={1} rows={1} {...props.areaMethods} />
          <Grid id="grid-pocket-4" cols={1} rows={1} {...props.areaMethods} />
        </div>

        <EquipSlot id="backpack" label="BACKPACK" areaMethods={props.areaMethods} />

        <EquipSlot id="pouch" label="POUCH" areaMethods={props.areaMethods} />
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
              margin-bottom: 1.5rem;
              background: #2b2b2b;

              & > :global(.grid-container) {
                margin-right: 2px;

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
