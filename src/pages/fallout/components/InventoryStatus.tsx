import React, { useState, useEffect } from 'react'
import moment from 'moment'
import _ from 'lodash'

interface InventoryStatusProps {
  items: any[]
}

export const InventoryStatus = (props: InventoryStatusProps) => {
  const { items } = props

  const weight = items.reduce((sum, item) => sum + item.weight, 0)
  const weightCapacity = 250
  const money = 2347
  const health = 180
  const healthCapacity = 200

  const [time, setTime] = useState(moment())

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    const interval = setInterval(() => setTime(moment()), 1000)
    return () => clearInterval(interval)
  }, [])

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div className="inventory-status">
      <div className="property">
        Weight&nbsp;&nbsp;&nbsp;&nbsp;
        {_.round(weight, 0)} / {weightCapacity}
      </div>

      <div className="property">
        Money&nbsp;&nbsp;&nbsp;&nbsp;
        {_.round(money, 0)}
      </div>

      <div className="property">
        Health&nbsp;&nbsp;&nbsp;&nbsp;
        {_.round(health, 0)} / {healthCapacity}
      </div>

      <div className="property align-right">
        {time.format('ddd, DD MMM')}
        <span style={{ width: 20, textAlign: 'center', opacity: 0.66 }}>/</span>
        {time.format('hh')}
        <span style={{ width: 6, textAlign: 'center', opacity: time.seconds() % 2 }}>:</span>
        {time.format('mm a')}
      </div>

      <style jsx>{`
        .inventory-status {
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
          align-items: stretch;

          & > .property {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            padding: 0.5rem 1rem;
            margin-right: 2px;
            background-color: #3b3f48;

            &.clickable {
              cursor: pointer;
            }

            &.align-right {
              justify-content: flex-end;
            }

            &:last-child {
              flex: 1;
              margin-right: none;
              margin-left: auto;
            }
          }
        }
      `}</style>
    </div>
  )
}
