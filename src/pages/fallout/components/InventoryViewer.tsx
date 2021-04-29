import React, { useRef, useEffect } from 'react'
import { FaWeightHanging } from 'react-icons/fa'
import keycode from 'keycode'

import { Keycode } from './Keycode'

import { SoundManager, Sounds } from '@services/sounds'

interface InventoryViewerProps {
  items: any[]
}

interface InventoryViewerState {
  selectedIndex: number
}

export class InventoryViewer extends React.Component<InventoryViewerProps, InventoryViewerState> {
  state = {
    selectedIndex: 0,
  }

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  componentDidMount() {
    document.addEventListener('keydown', this._handleKeys)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._handleKeys)
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.items !== this.props.items) {
      this.setState({ selectedIndex: 0 })
    }
  }

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  _handleKeys = (event: KeyboardEvent) => {
    switch (keycode(event)) {
      case 'w':
      case 'up':
        event.preventDefault()
        this._selectPrevItem()
        break

      case 's':
      case 'down':
        event.preventDefault()
        this._selectNextItem()
        break

      default:
        break
    }
  }

  _selectPrevItem = () => {
    const { items } = this.props
    const { selectedIndex } = this.state
    if (!!items[selectedIndex - 1]) {
      this.setState({ selectedIndex: selectedIndex - 1 })
      SoundManager.play(Sounds.FALLOUT.LIST_ITEM_PREV)
    }
  }

  _selectNextItem = () => {
    const { items } = this.props
    const { selectedIndex } = this.state
    if (!!items[selectedIndex + 1]) {
      this.setState({ selectedIndex: selectedIndex + 1 })
      SoundManager.play(Sounds.FALLOUT.LIST_ITEM_NEXT)
    }
  }

  _onSelectItem = (item: any, index: number) => {
    const { items } = this.props
    if (!!items[index]) {
      this.setState({ selectedIndex: index })
      SoundManager.play(Sounds.FALLOUT.LIST_ITEM_NEXT)
    }
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  render() {
    const { items } = this.props
    const { selectedIndex } = this.state

    return (
      <div className="inventory-viewer">
        <ItemList items={items} selectedIndex={selectedIndex} onSelectItem={this._onSelectItem} />

        <ItemDetails item={items[selectedIndex]} />

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

interface ItemListProps {
  items: any[]
  selectedIndex: number
  onSelectItem?: (...args: any[]) => any
}

export const ItemList = (props: ItemListProps) => {
  const { items = [], selectedIndex = 0, onSelectItem = () => {} } = props
  const itemsRef = useRef<any>([])

  // Make sure the selected item is always in view
  useEffect(() => {
    try {
      const item: any = itemsRef.current[selectedIndex]
      if (item) item.scrollIntoView({ block: 'nearest' })
    } catch (error) {
      console.error(error)
    }
  }, [selectedIndex])

  return (
    <div className="item-list">
      <div className="list">
        {items.map((item: any, index: number) => (
          <div
            ref={el => (itemsRef.current[index] = el)}
            key={`item-list-row-${index}-${item.id}`}
            className={`item-list-row ${selectedIndex === index ? 'selected' : ''}`}
            onMouseMove={() => {
              if (index !== selectedIndex) onSelectItem(item, index)
            }}
          >
            <div className="name">
              {item.name}
              {item.count ? ` (${item.count})` : ''}
            </div>

            <div className="flex-spacer"></div>

            <div className="weight">
              {item.weight}
              {item.count ? ` (${item.count * item.weight})` : ''}
              <FaWeightHanging size={10} style={{ marginLeft: '0.75rem' }} />
            </div>
          </div>
        ))}
      </div>

      <div className="filters">
        <div className="filter">
          <Keycode value="R" style={{ marginRight: '0.75rem' }} />
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
                color: var(--main-background-color);
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

interface ItemDetailsProps {
  item: any
}

export const ItemDetails = (props: ItemDetailsProps) => {
  const { item = {} } = props
  let { image, level, weight, value, count } = item

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

interface ItemDetailsPropertyProps {
  label: string
  value: string
}

export const ItemDetailsProperty = (props: ItemDetailsPropertyProps) => {
  const { label, value } = props

  return (
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
}
