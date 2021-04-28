import React, { useRef, useEffect } from 'react'
import _ from 'lodash'
import keycode from 'keycode'

import { Keycode } from '../Keycode'

import { SoundManager, Sounds } from '@services/sounds'

//
// ─── TABS ───────────────────────────────────────────────────────────────────────
//

interface TabsProps {
  items: any[]
  selected: string
  onChange?: (...args: any[]) => any
}

export const Tabs = (props: TabsProps) => {
  const { items, selected, onChange = () => {} } = props

  const prevTabKeycodeRef = useRef<any>()
  const nextTabKeycodeRef = useRef<any>()

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    document.addEventListener('keydown', _handleKeys)
    return () => document.removeEventListener('keydown', _handleKeys)
  })

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const _handleKeys = (event: KeyboardEvent) => {
    switch (keycode(event)) {
      case 'a':
      case 'left':
        _toPrevTab()
        break

      case 'd':
      case 'right':
        _toNextTab()
        break

      default:
        break
    }
  }

  const _toPrevTab = () => {
    try {
      const prevTab = items[items.indexOf(selected) - 1]

      prevTabKeycodeRef.current.jiggle(({ animating }: any) => {
        if (animating) return true

        if (!prevTab) return SoundManager.play(Sounds.FALLOUT.TAB_ERROR)

        onChange(prevTab, 'left')
        SoundManager.play(Sounds.FALLOUT.TAB_PREV)
      })
    } catch (error) {
      console.error(error)
    }
  }

  const _toNextTab = () => {
    try {
      const nextTab = items[items.indexOf(selected) + 1]

      nextTabKeycodeRef.current.jiggle(({ animating }: any) => {
        if (animating) return true

        if (!nextTab) return SoundManager.play(Sounds.FALLOUT.TAB_ERROR)

        onChange(nextTab, 'right')
        SoundManager.play(Sounds.FALLOUT.TAB_NEXT)
      })
    } catch (error) {
      console.error(error)
    }
  }

  const _onClickTab = (tab: string, index: number) => () => {
    try {
      const direction = items.indexOf(selected) > index ? 'left' : 'right'

      onChange(tab, direction)
      SoundManager.play(Sounds.FALLOUT.TAB_NEXT)
    } catch (error) {
      console.error(error)
    }
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div className="tabs">
      <Keycode ref={prevTabKeycodeRef} value="A" style={{ margin: '0 1rem' }} />

      {items.map((tab, index) => {
        const classes = []
        if (selected === tab) classes.push('selected')
        if (index === 0) classes.push('first')
        if (index === items.length - 1) classes.push('last')

        return (
          <div
            key={`sub-tab-${index}-${tab}`}
            className={`tab ${classes.join(' ')}`}
            onClick={_onClickTab(tab, index)}
          >
            {_.upperCase(tab)}
          </div>
        )
      })}

      <Keycode ref={nextTabKeycodeRef} value="D" style={{ margin: '0 1rem' }} />

      <style jsx>{`
        .tabs {
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          margin: 0.5rem;

          .tab {
            padding: 0.25rem 0.5rem;
            margin: 0 0.5rem;
            border-radius: 0.25rem;
            transition: 0.25s ease all;
            cursor: pointer;

            &:hover {
              color: #0e0e0e;
              background-color: rgba(255, 255, 255, 0.5);
            }

            &.selected {
              color: #282c34;
              background-color: #ffffff;
            }
          }
        }
      `}</style>
    </div>
  )
}
