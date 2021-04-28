import React from 'react'

//
// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
//

export const RadioSectionTabs = [{ name: 'a' }, { name: 'b' }, { name: 'c' }]

//
// ─── DEFINITION ─────────────────────────────────────────────────────────────────
//

interface RadioSectionProps {
  tab: string
}

export const RadioSection = (props: RadioSectionProps) => {
  return <div>Radio {props.tab}</div>
}
