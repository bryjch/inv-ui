import React from 'react'

import { Map } from '../Map/Map'

import { hexToRgba } from '@utils/styling'

//
// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
//

export const DataSectionTabs = [{ name: 'quests' }, { name: 'map' }, { name: 'journal' }]

//
// ─── DEFINITION ─────────────────────────────────────────────────────────────────
//

interface DataSectionProps {
  tab: string
}

export const DataSection = (props: DataSectionProps) => {
  const { tab } = props

  return (
    <section id="data-section">
      {(() => {
        switch (tab) {
          case 'quests':
            return <QuestsTab />

          case 'map':
            return <MapTab />

          case 'journal':
            return <JournalTab />

          default:
            return null
        }
      })()}

      <style jsx>{`
        #data-section {
          display: flex;
          flex-flow: column nowrap;
          flex: 1;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}

const QuestsTab = () => {
  return <div id="quests-tab">Quests</div>
}

const MapTab = () => {
  return (
    <>
      <div id="map-tab">
        <Map />

        <style jsx>{`
          #map-tab {
            width: 100%;
            height: 100%;
            border: 1px solid ${hexToRgba('#92aad8', 0.33)};
          }
        `}</style>
      </div>
    </>
  )
}

const JournalTab = () => {
  return <div id="journal-tab">Journal</div>
}
