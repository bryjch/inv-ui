import React from 'react'
import { FaWeightHanging } from 'react-icons/fa'

import { SoundManager, Sounds } from '@services/sounds'

export class InventoryViewer extends React.Component {
  state = {
    items: [],
    selected: 0,
  }

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  componentDidMount() {
    document.addEventListener('keydown', this._handleKeys)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.items !== this.props.items) {
      this.setState({ selected: 0 })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._handleKeys)
  }

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  _handleKeys = ({ key }) => {
    switch (key) {
      case 'w':
      case 'ArrowUp':
        this._selectPrevItem()
        break

      case 's':
      case 'ArrowDown':
        this._selectNextItem()
        break

      default:
        break
    }
  }

  _selectPrevItem = () => {
    const { items } = this.props
    const { selected } = this.state
    if (!!items[selected - 1]) {
      this.setState({ selected: selected - 1 })
      SoundManager.play(Sounds.FALLOUT.LIST_ITEM_PREV)
    }
  }

  _selectNextItem = () => {
    const { items } = this.props
    const { selected } = this.state
    if (!!items[selected + 1]) {
      this.setState({ selected: selected + 1 })
      SoundManager.play(Sounds.FALLOUT.LIST_ITEM_NEXT)
    }
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  render() {
    const { items } = this.props
    const { selected } = this.state

    return (
      <div className="inventory-viewer">
        <ItemList
          items={items}
          selected={selected}
          onSelectItem={(item, index) => {
            this.setState({ selected: index })
            SoundManager.play(Sounds.FALLOUT.LIST_ITEM_NEXT)
          }}
        />

        <ItemDetails selected={items[selected]} />

        <style jsx>{`
          .inventory-viewer {
            flex: 1;
            display: flex;
            flex-flow: row nowrap;
            overflow: hidden;
          }
        `}</style>
      </div>
    )
  }
}

export const ItemList = ({ items = [], selected = null, onSelectItem = () => {} }) => {
  return (
    <div className="item-list">
      <div className="list">
        {items.map((item, index) => (
          <div
            key={`item-list-row-${index}-${item.id}`}
            className={`item-list-row ${selected === index ? 'selected' : ''}`}
            onMouseEnter={() => onSelectItem(item, index)}
          >
            <div className="name">
              {item.name}
              {item.count ? ` (${item.count})` : ''}
            </div>

            <div className="flex-spacer"></div>

            <div className="weight">
              {/* {item.count
                ? item.count === 1
                  ? `${item.weight}`
                  : `${item.weight} (${item.weight * item.count})`
                : `${item.weight}`} */}

              {item.weight}
              {item.count ? ` (${item.count * item.weight})` : ''}
              <FaWeightHanging size={10} style={{ marginLeft: '0.75rem' }} />
            </div>
          </div>
        ))}
      </div>

      <div className="filters">
        <div className="filter">
          <div className="keycode simple" style={{ marginRight: '0.75rem' }}>
            R
          </div>
          Sort
        </div>
      </div>

      <style jsx>{`
        .item-list {
          flex: 6;
          display: flex;
          flex-flow: column nowrap;
          justify-content: flex-start;
          align-items: flex-start;
          margin-bottom: 1rem;
          margin-right: 1rem;
          border: 1px solid #ffffff;

          .list {
            flex: 1;
            display: flex;
            flex-flow: column nowrap;
            width: 100%;
            overflow-y: scroll;

            .item-list-row {
              display: flex;
              flex-flow: row nowrap;
              justify-content: flex-start;
              align-items: center;
              width: 100%;
              padding: 0.5rem;
              border-bottom: 1px solid #ffffff;
              cursor: pointer;

              &.selected {
                color: #282c34;
                background-color: #ffffff;
              }

              &:last-child {
                margin-bottom: -1px; // Account for bottom border
              }
            }
          }

          .filters {
            display: flex;
            flex-flow: row nowrap;
            width: 100%;
            padding: 0.5rem 1rem;
            border-top: 1px solid #ffffff;

            .filter {
              display: flex;
              flex-flow: row nowrap;
            }
          }
        }
      `}</style>
    </div>
  )
}

export const ItemDetails = ({ selected = {} }) => {
  let { image, level, weight, value, count } = selected

  if (!!count) {
    weight = `${weight} (${weight * count})`
    value = `${value} (${value * count})`
  }

  return (
    <div className="item-details">
      <div className="image-preview">
        {image ? (
          <div className="image" style={{ backgroundImage: `url(${image})` }} />
        ) : (
          <div className="image missing" />
        )}
      </div>

      <div className="properties">
        {level && <ItemDetailsProperty label="Level" value={level} />}
        {weight && <ItemDetailsProperty label="Weight" value={weight} />}
        {value && <ItemDetailsProperty label="Value" value={value} />}
      </div>

      <style jsx>{`
        .item-details {
          flex: 4;
          display: flex;
          flex-flow: column nowrap;
          justify-content: flex-start;
          align-items: flex-start;
          margin-bottom: 1rem;

          & > .image-preview {
            flex: 1;
            width: 100%;
            border: 1px solid #ffffff;
            border-bottom: none;

            & > .image {
              position: relative;
              width: 100%;
              height: 0;
              padding-bottom: 100%;
              background-size: cover;
            }

            & > .missing {
              &:after {
                content: 'IMAGE UNAVAILABLE';
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.7rem;
                font-weight: 700;
                color: rgba(255, 255, 255, 0.5);
                letter-spacing: 2px;
              }
            }
          }

          & > .properties {
            width: 100%;
            border: 1px solid #ffffff;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export const ItemDetailsProperty = ({ label, value }) => (
  <div className="property">
    <div className="label">{label}</div>
    <div className="value">{value}</div>

    <style jsx>{`
      .property {
        display: flex;
        width: 100%;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;

        .label {
        }

        .value {
          font-weight: bold;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    `}</style>
  </div>
)
