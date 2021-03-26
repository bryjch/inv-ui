import React, { useState } from 'react'
import Tilt from 'react-parallax-tilt'
import { Transition, animated } from 'react-spring/renderprops'

import { Sections } from './Navigation/Sections'
import { Tabs } from './Navigation/Tabs'

import { ItemSection } from './Sections/ItemSection'
import { StatSection } from './Sections/StatSection'
import { DataSection } from './Sections/DataSection'
import { RadioSection } from './Sections/RadioSection'

import { useStore } from '@zus/store'

//
// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
//

const VIEWPORT_WIDTH = '800px'
const VIEWPORT_HEIGHT = '600px'

const HIERARCHY = {
  sections: [
    {
      name: 'stat',
      tabs: [{ name: 'status' }, { name: 'effects' }, { name: 'special' }],
    },
    {
      name: 'item',
      tabs: [
        { name: 'all' },
        { name: 'weapons' },
        { name: 'apparel' },
        { name: 'aid' },
        { name: 'misc' },
      ],
    },
    {
      name: 'data',
      tabs: [{ name: 'quests' }, { name: 'map' }, { name: 'journal' }],
    },
    {
      name: 'radio',
      tabs: [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
    },
  ],
}

//
// ─── DEFINITION ─────────────────────────────────────────────────────────────────
//

export const Viewport = () => {
  const [activeSection, setActiveSection] = useState(HIERARCHY.sections[0].name)
  const [activeTab, setActiveTab] = useState(HIERARCHY.sections[0].tabs[0].name)
  const [direction, setDirection] = useState<'left' | 'right'>('right') // Keep track which direction we should animate the sections
  const [lastTabs, setLastTabs] = useState<{ [key: string]: string }>({}) // Keep track of the last sub tabs that was accessed per section

  const settings = useStore(state => state.settings)

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const _onChangeSection: any = (nextSection: string, direction: 'left' | 'right') => {
    // Try to find the last tab the user left this section on
    // Otherwise, just go to the first tab
    const tab =
      lastTabs[nextSection] ||
      HIERARCHY.sections.find(({ name }) => name === nextSection)?.tabs[0]?.name ||
      ''

    setDirection(direction)
    setActiveSection(nextSection)
    setActiveTab(tab)
  }

  const _onChangeTab: any = (nextTab: string) => {
    setActiveTab(nextTab)
    setLastTabs({ ...lastTabs, [activeSection]: nextTab })
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const animation = {
    left: {
      from: { position: 'absolute', transform: 'translate3d(-50%,0,0)', opacity: 0 },
      enter: { transform: 'translate3d(0,0,0)', opacity: 1 },
      leave: { transform: 'translate3d(10%,0,0)', opacity: 0 },
    },
    right: {
      from: { position: 'absolute', transform: 'translate3d(50%,0,0)', opacity: 0 },
      enter: { transform: 'translate3d(0,0,0)', opacity: 1 },
      leave: { transform: 'translate3d(-10%,0,0)', opacity: 0 },
    },
  }

  const sections = HIERARCHY.sections.map(({ name }) => name)
  const tabs =
    HIERARCHY.sections.find(({ name }) => name === activeSection)?.tabs.map(tab => tab.name) || []

  return (
    <Tilt
      className="tilt-container"
      tiltMaxAngleX={settings.tiltEnabled ? 5 : 0}
      tiltMaxAngleY={settings.tiltEnabled ? 5 : 0}
      scale={settings.tiltEnabled ? 1.03 : 1}
    >
      <div id="viewport">
        <div className="navigation">
          <Sections items={sections} selected={activeSection} onChange={_onChangeSection} />
          <Tabs items={tabs} selected={activeTab} onChange={_onChangeTab} />
        </div>

        <div className="content-container">
          <Transition
            items={activeSection}
            config={{ mass: 1, tension: 500, friction: 40 }}
            {...animation[direction]}
          >
            {(section: string) => (anim: any) => (
              <animated.div className="animated-content" style={anim}>
                {(() => {
                  switch (section) {
                    case 'stat':
                      return <StatSection tab={activeTab} />
                    case 'item':
                      return <ItemSection tab={activeTab} />
                    case 'data':
                      return <DataSection tab={activeTab} />
                    case 'radio':
                      return <RadioSection tab={activeTab} />
                    default:
                      return null
                  }
                })()}
              </animated.div>
            )}
          </Transition>
        </div>

        <style jsx global>{`
          .tilt-container {
            width: ${VIEWPORT_WIDTH};
            height: ${VIEWPORT_HEIGHT};
          }

          #viewport {
            display: flex;
            flex-flow: column nowrap;
            width: 100%;
            max-width: ${VIEWPORT_WIDTH};
            min-height: ${VIEWPORT_HEIGHT};
            margin-bottom: 40px;

            .navigation {
              position: relative;
              overflow: hidden;
            }

            .content-container {
              position: relative;
              flex: 1;
              display: flex;
              flex-flow: column nowrap;

              .animated-content {
                width: 100%;
                height: 100%;
                padding: 1rem 0;
                overflow: hidden;
                display: flex;
                flex-flow: column nowrap;
              }
            }
          }
        `}</style>
      </div>
    </Tilt>
  )
}

export default Viewport
