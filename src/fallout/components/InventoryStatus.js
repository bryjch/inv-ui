import React, { useState, useEffect } from 'react'
import moment from 'moment'
import _ from 'lodash'

export const InventoryStatus = ({ items = [], onPressSort = () => {} }) => {
  const weight = items.reduce((sum, item) => sum + item.weight, 0)
  const weightCapacity = 250
  const money = 2347
  const health = 180
  const healthCapacity = 200

  const [time, setTime] = useState(new moment())

  useEffect(() => {
    const interval = setInterval(() => setTime(new moment()), 1000)
    return () => clearInterval(interval)
  }, [])

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

      <div className="property clickable" onClick={onPressSort}>
        <div className="keycode simple" style={{ marginRight: '0.75rem' }}>
          R
        </div>
        Sort
      </div>

      <div className="property">
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
          border: 1px solid #ffffff;

          & > .property {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            padding: 0.5rem 1rem;
            border-right: 1px solid #ffffff;

            &.clickable {
              cursor: pointer;
            }

            &:last-child {
              border-right: none;
              margin-left: auto;
            }
          }
        }
      `}</style>
    </div>
  )
}
