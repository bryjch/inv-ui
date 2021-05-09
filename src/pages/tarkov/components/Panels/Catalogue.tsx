import { Listing } from '../Listing'

export interface CatalogueProps {
  areaMethods: { [key: string]: (...args: any[]) => any }
}

export const Catalogue = (props: CatalogueProps) => {
  return (
    <div className="panel">
      <Listing id="listing-catalogue" {...props.areaMethods} />
    </div>
  )
}
