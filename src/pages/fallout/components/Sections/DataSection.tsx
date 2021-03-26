import React from 'react'

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
  return <div>Data {props.tab}</div>
}
