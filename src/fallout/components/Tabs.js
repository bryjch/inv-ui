import React, { useState, useEffect } from 'react'
import anime from 'animejs/lib/anime.es.js'
import _ from 'lodash'

import { SoundManager } from 'services'

const BUMP_KEYCODE_ANIME = {
  translateY: 2,
  opacity: 1,
  duration: 75,
  direction: 'alternate',
  easing: 'easeInOutQuad',
  autoplay: false,
}

//
// ─── SECTIONS ───────────────────────────────────────────────────────────────────
//

export const Sections = ({ items = [], selected, onChange = () => {} }) => {
  const [animations, setAnimations] = useState({})

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    document.addEventListener('keydown', _handleKeys)
    return () => document.removeEventListener('keydown', _handleKeys)
  })

  useEffect(() => {
    setAnimations({
      bumpPrev: anime({ targets: ['.keycode.prev-section'], ...BUMP_KEYCODE_ANIME }),
      bumpNext: anime({ targets: ['.keycode.next-section'], ...BUMP_KEYCODE_ANIME }),
    })
  }, [])

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
    const { bumpPrev } = animations
    const prevSection = items[items.indexOf(selected) - 1]

    if (!!prevSection) onChange(prevSection, 'left')

    if (bumpPrev.paused || bumpPrev.completed) {
      bumpPrev.play()
      SoundManager.play(!!prevSection ? 'FALLOUT/SECTION_NEXT' : 'FALLOUT/SECTION_ERROR')
    }
  }

  const _toNextSection = () => {
    const { bumpNext } = animations
    const nextSection = items[items.indexOf(selected) + 1]

    if (!!nextSection) onChange(nextSection, 'right')

    if (bumpNext.paused || bumpNext.completed) {
      bumpNext.play()
      SoundManager.play(!!nextSection ? 'FALLOUT/SECTION_NEXT' : 'FALLOUT/SECTION_ERROR')
    }
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div className="sections">
      <div className="keycode simple prev-section" style={{ margin: '0 1rem' }}>
        Q
      </div>

      {items.map((section, index) => (
        <div
          key={`section-${index}-${section}`}
          className={`section ${selected === section ? 'selected' : ''}`}
          onClick={() => onChange(section, items.indexOf(selected) > index ? 'left' : 'right')}
        >
          {_.upperCase(section)}
        </div>
      ))}

      <div className="keycode simple next-section" style={{ margin: '0 1rem' }}>
        E
      </div>

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
  const [animations, setAnimations] = useState({})

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    document.addEventListener('keydown', _handleKeys)
    return () => document.removeEventListener('keydown', _handleKeys)
  })

  useEffect(() => {
    setAnimations({
      bumpPrev: anime({ targets: ['.keycode.prev-tab'], ...BUMP_KEYCODE_ANIME }),
      bumpNext: anime({ targets: ['.keycode.next-tab'], ...BUMP_KEYCODE_ANIME }),
    })
  }, [])

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
    const { bumpPrev } = animations
    const prevTab = items[items.indexOf(selected) - 1]

    if (!!prevTab) onChange(prevTab, 'left')

    if (bumpPrev.paused || bumpPrev.completed) {
      bumpPrev.play()
      SoundManager.play(!!prevTab ? 'FALLOUT/TAB_PREV' : 'FALLOUT/TAB_ERROR')
    }
  }

  const _toNextTab = () => {
    const { bumpNext } = animations
    const nextTab = items[items.indexOf(selected) + 1]

    if (!!nextTab) onChange(nextTab, 'right')

    if (bumpNext.paused || bumpNext.completed) {
      bumpNext.play()
      SoundManager.play(!!nextTab ? 'FALLOUT/TAB_NEXT' : 'FALLOUT/TAB_ERROR')
    }
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div className="tabs">
      <div className="keycode simple prev-tab" style={{ margin: '0 1rem' }}>
        A
      </div>

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

      <div className="keycode simple next-tab" style={{ margin: '0 1rem' }}>
        D
      </div>

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
