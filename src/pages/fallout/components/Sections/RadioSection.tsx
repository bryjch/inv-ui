import React from 'react'

interface RadioSectionProps {
  tab: string
}

export const RadioSection = (props: RadioSectionProps) => {
  return <div>Radio {props.tab}</div>
}
