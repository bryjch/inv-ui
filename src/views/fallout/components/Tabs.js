import React, { useRef, useEffect } from 'react'
import _ from 'lodash'

import { Keycode } from '@views/fallout/components/Keycode'

import { SoundManager, Sounds } from '@services/sounds'

//
// ─── SECTIONS ───────────────────────────────────────────────────────────────────
//

export const Sections = ({ items = [], selected, onChange = () => {} }) => {
  const prevSectionKeycodeRef = useRef()
  const nextSectionKeycodeRef = useRef()

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

  const _handleKeys = ({ key }) => {
    switch (key) {
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

      prevSectionKeycodeRef.current.jiggle(({ animating }) => {
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

      nextSectionKeycodeRef.current.jiggle(({ animating }) => {
        if (animating) return true

        if (!nextSection) return SoundManager.play(Sounds.FALLOUT.SECTION_ERROR)

        onChange(nextSection, 'right')
        SoundManager.play(Sounds.FALLOUT.SECTION_NEXT)
      })
    } catch (error) {
      console.error(error)
    }
  }

  const _onClickSection = (section, index) => () => {
    try {
      const direction = items.indexOf(selected) > index ? 'left' : 'right'

      onChange(section, direction)
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
              color: #282c34;
              background-color: #ffffff;
            }
          }
        }
      `}</style>
    </div>
  )
}

//
// ─── SUB TABS ───────────────────────────────────────────────────────────────────
//

export const SubTabs = ({ items = [], selected, onChange = () => {} }) => {
  const prevTabKeycodeRef = useRef()
  const nextTabKeycodeRef = useRef()

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

  const _handleKeys = ({ key }) => {
    switch (key) {
      case 'a':
      case 'ArrowLeft':
        _toPrevTab()
        break

      case 'd':
      case 'ArrowRight':
        _toNextTab()
        break

      default:
        break
    }
  }

  const _toPrevTab = () => {
    try {
      const prevTab = items[items.indexOf(selected) - 1]

      prevTabKeycodeRef.current.jiggle(({ animating }) => {
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

      nextTabKeycodeRef.current.jiggle(({ animating }) => {
        if (animating) return true

        if (!nextTab) return SoundManager.play(Sounds.FALLOUT.TAB_ERROR)

        onChange(nextTab, 'right')
        SoundManager.play(Sounds.FALLOUT.TAB_NEXT)
      })
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
            onClick={() => onChange(tab, items.indexOf(selected) > index ? 'left' : 'right')}
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
