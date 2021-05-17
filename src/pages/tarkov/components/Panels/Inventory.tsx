import { Grid } from '../Grid'
import { EquipHeader } from '../Misc/EquipHeader'

export interface InventoryProps {
  areaMethods: { [key: string]: (...args: any[]) => any }
}

export const Inventory = (props: InventoryProps) => {
  return (
    <div id="inventory" className="panel">
      <div className="panel-title">INVENTORY</div>

      <div className="grids">
        <EquipHeader label="CHEST RIG" />
        <Grid id="grid-rig" cols={2} rows={2} {...props.areaMethods} />

        <EquipHeader label="POCKETS" />
        <div id="pockets">
          <Grid id="grid-pocket-1" cols={1} rows={1} {...props.areaMethods} />
          <Grid id="grid-pocket-2" cols={1} rows={1} {...props.areaMethods} />
          <Grid id="grid-pocket-3" cols={1} rows={1} {...props.areaMethods} />
          <Grid id="grid-pocket-4" cols={1} rows={1} {...props.areaMethods} />
        </div>

        <EquipHeader label="BACKPACK" />
        <Grid id="grid-backpack" cols={2} rows={2} {...props.areaMethods} />

        <EquipHeader label="POUCH" />
        <Grid id="grid-pouch" cols={2} rows={2} {...props.areaMethods} />
      </div>

      <style jsx>{`
        #inventory {
          flex: 1;

          .grids {
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            width: 100%;
            overflow-y: auto;
            padding-right: 1rem;

            #pockets {
              display: flex;
              flex-flow: row nowrap;
              margin-bottom: 10px;
              background: #2b2b2b;

              & > :global(.grid-container) {
                margin-right: 2px;

                &:last-child {
                  margin-right: 0px;
                }
              }
            }

            & > :global(.grid-container) {
              margin-bottom: 10px;

              &:last-child {
                margin-bottom: 1px;
              }
            }
          }
        }
      `}</style>
    </div>
  )
}
