import React, { useState } from 'react'
import { entries } from 'lodash'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

import { dispatch } from '@zus/minecraft/store'
import { addItemToInventoryAction, purgeInventoryAction } from '@zus/minecraft/actions'

import { hexToRgba } from '@utils/styling'

import items from '../data/items.json'

export const Cheats = () => {
  const itemOptions = entries(items).map(([key, value]) => ({ key, ...value }))
  const quantityOptions = [1, 8, 16, 32, 64]

  const [selectedItem, setSelectedItem] = useState(itemOptions[0].key)
  const [selectedQuantity, setSelectedQuantity] = useState(quantityOptions[0])

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const addItem = (iid: string, quantity: number) => () => {
    dispatch(addItemToInventoryAction(iid, quantity))
  }

  const purgeInventory = () => {
    dispatch(purgeInventoryAction())
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div className="cheats">
      <div className="options item-options">
        {itemOptions.map(option => (
          <button
            key={`item-option-${option.key}`}
            className={`option ${selectedItem === option.key ? 'selected' : ''}`}
            onClick={() => setSelectedItem(option.key)}
          >
            <img src={option.image} alt={option.displayName} />
          </button>
        ))}
      </div>

      <div className="options quantity-options">
        {quantityOptions.map(option => (
          <button
            key={`quantity-option-${option}`}
            className={`option ${selectedQuantity === option ? 'selected' : ''}`}
            onClick={() => setSelectedQuantity(option)}
          >
            <small>x</small>
            {option}
          </button>
        ))}
      </div>

      <div className="options misc-options">
        <button className="option add" onClick={addItem(selectedItem, selectedQuantity)}>
          <FiPlus size={24} />
        </button>

        <button className="option delete" onClick={purgeInventory}>
          <FiTrash2 size={24} />
        </button>
      </div>

      <style jsx>{`
        .cheats {
          position: relative;
          z-index: 300;
          border-radius: 4px;
          display: flex;
          flex-flow: row wrap;
          align-items: stretch;
          font-family: Minecraftia;

          button {
            background: none;
            border: none;
            cursor: pointer;
            user-select: none;
            color: #ffffff;
          }

          .options {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            margin: 0 0.25rem;

            .option {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 40px;
              height: 40px;
              margin: 0 0.2rem;
              padding: 4px;
              border-radius: 50%;
              transform: scale(0.9);
              transition: 0.1s ease all;

              &:hover {
                background-color: rgba(255, 255, 255, 0.3);
                transform: scale(1);
              }

              &.selected {
                background: rgba(255, 255, 255, 0.6);
              }
            }
          }

          .item-options {
            .option {
              img {
                width: 100%;
                height: 100%;
                image-rendering: -webkit-optimize-contrast;
                user-select: none;
                -webkit-user-drag: none;
              }

              &.selected {
                background: rgba(255, 255, 255, 0.6);
              }
            }
          }

          .quantity-options {
            .option {
              // background-color: rgba(255, 255, 255, 0.1);
            }
          }

          .misc-options {
            .option.add {
              margin-left: 1rem;
              background-color: #5271ae;

              &:hover {
                background-color: #7b9cdc;
              }
            }

            .option.delete {
              margin-left: 0.33rem;
              background-color: ${hexToRgba('#ce3333', 0.2)};
              color: ${hexToRgba('#ffffff', 0.6)};

              &:hover {
                background-color: #ce3333;
                color: #ffffff;
              }
            }
          }
        }
      `}</style>
    </div>
  )
}
