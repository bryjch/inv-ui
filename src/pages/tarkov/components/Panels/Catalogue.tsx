import { Listing } from '../Listing'

export interface CatalogueProps {
  areaMethods: { [key: string]: (...args: any[]) => any }
}

export const Catalogue = (props: CatalogueProps) => {
  return (
    <div id="catalogue" className="panel">
      <div className="panel-title">CATALOGUE</div>

      <div className="listings">
        <Listing id="listing-catalogue" {...props.areaMethods} />
      </div>

      <style jsx>{`
        #catalogue {
          flex: 1;

          .listings {
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            width: 100%;
            overflow-y: auto;
            padding-right: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
