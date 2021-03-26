import React from 'react'

interface DataSectionProps {
  tab: string
}

export const DataSection = (props: DataSectionProps) => {
  return <div>Data {props.tab}</div>
}
