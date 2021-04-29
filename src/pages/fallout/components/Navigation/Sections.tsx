import React, { useRef, useEffect } from 'react'
import _ from 'lodash'
import keycode from 'keycode'

import { Keycode } from '../Keycode'

import { SoundManager, Sounds } from '@services/sounds'

//
// ─── SECTIONS ───────────────────────────────────────────────────────────────────
//

interface SectionProps {
  items: any[]
  selected: string
  onChange?: (...args: any[]) => any
}

export const Sections = (props: SectionProps) => {
  const { items, selected, onChange = () => {} } = props

  const prevSectionKeycodeRef = useRef<any>()
  const nextSectionKeycodeRef = useRef<any>()

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
      case 'q':
        _toPrevSection()
        break

      case 'e':
        _toNextSection()
        break

      default:
        break
    }
  }

  const _toPrevSection = () => {
    try {
      const prevSection = items[items.indexOf(selected) - 1]

      prevSectionKeycodeRef.current?.jiggle(({ animating }: any) => {
        if (animating) return true

        if (!prevSection) return SoundManager.play(Sounds.FALLOUT.SECTION_ERROR)

        onChange(prevSection, 'left')
        SoundManager.play(Sounds.FALLOUT.SECTION_PREV)
      })
    } catch (error) {
      console.error(error)
    }
  }

  const _toNextSection = () => {
    try {
      const nextSection = items[items.indexOf(selected) + 1]

      nextSectionKeycodeRef.current?.jiggle(({ animating }: any) => {
        if (animating) return true

        if (!nextSection) return SoundManager.play(Sounds.FALLOUT.SECTION_ERROR)

        onChange(nextSection, 'right')
        SoundManager.play(Sounds.FALLOUT.SECTION_NEXT)
      })
    } catch (error) {
      console.error(error)
    }
  }

  const _onClickSection = (section: string, index: number) => () => {
    try {
      const direction = items.indexOf(selected) > index ? 'left' : 'right'

      onChange(section, direction)
      SoundManager.play(Sounds.FALLOUT.SECTION_NEXT)
    } catch (error) {
      console.error(error)
    }
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div className="sections">
      <Keycode ref={prevSectionKeycodeRef} value="Q" style={{ margin: '0 1rem' }} />

      {items.map((section, index) => (
        <div
          key={`section-${index}-${section}`}
          className={`section ${selected === section ? 'selected' : ''}`}
          onClick={_onClickSection(section, index)}
        >
          {_.upperCase(section)}
        </div>
      ))}

      <Keycode ref={nextSectionKeycodeRef} value="E" style={{ margin: '0 1rem' }} />

      <style jsx>{`
        .sections {
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          margin: 0.5rem 0;
          border-bottom: 1px solid #ffffff;

          .section {
            padding: 0.33rem 0.66rem;
            margin: 0 0.5rem;
            font-size: 1.5rem;
            border-radius: 0.25rem;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            transition: 0.25s ease all;
            cursor: pointer;

            &:hover {
              color: #0e0e0e;
              background-color: rgba(255, 255, 255, 0.5);
            }

            &.selected {
              color: var(--main-background-color);
              background-color: #ffffff;
            }
          }
        }
      `}</style>
    </div>
  )
}
