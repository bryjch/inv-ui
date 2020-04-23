import React from 'react'
import _ from 'lodash'
import Tilt from 'react-tilt'
import { Transition, animated } from 'react-spring/renderprops'

import weapons from '../data/weapons'
import apparel from '../data/apparel'
import aid from '../data/aid'
import misc from '../data/misc'

import { Sections, SubTabs } from './Tabs'
import { InventoryViewer } from './InventoryViewer'
import { InventoryStatus } from './InventoryStatus'

const HIERARCHY = [
  { section: 'stat', tabs: ['status', 'effects', 'special'] },
  { section: 'item', tabs: ['all', 'weapons', 'apparel', 'aid', 'misc'] },
  { section: 'data', tabs: ['quests', 'map', 'journal'] },
  { section: 'radio', tabs: ['a', 'b', 'c'] },
]

const SECTIONS = () => HIERARCHY.map(i => i.section)
const TABS = section => HIERARCHY.find(i => i.section === section)?.tabs || undefined

export class Viewport extends React.Component {
  constructor() {
    super()

    this.state = {
      items: [...weapons, ...apparel, ...aid, ...misc],

      section: 'item',
      tab: 'all',
      direction: 'right',

      // Keep track of the last sub tabs that was accessed
      lastTabs: {
        stat: TABS('stat')[0],
        item: TABS('item')[0],
        data: TABS('data')[0],
        radio: TABS('radio')[0],
      },
    }
  }

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  _onChangeSection = (nextSection, direction) => {
    const { lastTabs } = this.state

    this.setState({ section: nextSection, tab: lastTabs[nextSection], direction: direction })
  }

  _onChangeTab = (nextTab, direction) => {
    const { section, lastTabs } = this.state

    this.setState({ tab: nextTab, lastTabs: { ...lastTabs, [section]: nextTab } })
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  animation = {
    left: {
      from: { position: 'absolute', transform: 'translate3d(-10%,0,0)', opacity: 0 },
      enter: { transform: 'translate3d(0,0,0)', opacity: 1 },
      leave: { transform: 'translate3d(10%,0,0)', opacity: 0 },
    },
    right: {
      from: { position: 'absolute', transform: 'translate3d(10%,0,0)', opacity: 0 },
      enter: { transform: 'translate3d(0,0,0)', opacity: 1 },
      leave: { transform: 'translate3d(-10%,0,0)', opacity: 0 },
    },
  }

  render() {
    const { section, tab, direction } = this.state

    return (
      <Tilt className="tilt-container" options={{ max: 10, scale: 1.03 }}>
        <div id="viewport">
          <div className="navigation">
            <Sections items={SECTIONS()} selected={section} onChange={this._onChangeSection} />
            <SubTabs items={TABS(section)} selected={tab} onChange={this._onChangeTab} />
          </div>

          <div className="content-container">
            <Transition
              items={section}
              config={{ mass: 1, tension: 500, friction: 40 }}
              {...this.animation[direction]}
            >
              {section => anim => (
                <animated.div className="animated-content" style={anim}>
                  {section === 'stat'
                    ? this._renderStatSection()
                    : section === 'item'
                    ? this._renderItemSection()
                    : section === 'data'
                    ? this._renderDataSection()
                    : section === 'radio'
                    ? this._renderRadioSection()
                    : null}
                </animated.div>
              )}
            </Transition>
          </div>

          <style jsx>{`
            #viewport {
              .content-container {
              }
            }
          `}</style>

          <style jsx global>{`
            .tilt-container {
              width: 800px;
              height: 600px;
            }

            #viewport {
              display: flex;
              flex-flow: column nowrap;
              width: 100%;
              max-width: 800px;
              min-height: 600px;
              margin-bottom: 40px;
              overflow: hidden;

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

  _renderStatSection = () => {
    return (
      <div style={{ border: '1px solid #545454', padding: '1rem' }}>
        <div>TBD</div>
      </div>
    )
  }

  _renderItemSection = () => {
    const { tab, items } = this.state

    const filters = []
    if (tab !== 'all') filters.push(tab)

    let itemsFiltered = items
    if (filters.length > 0) {
      itemsFiltered = items.filter(item => _.intersection(item.tags, filters).length > 0)
    }

    return (
      <>
        <InventoryViewer items={itemsFiltered} />
        <InventoryStatus items={items} onPressSort={() => console.log('SORT')} />
      </>
    )
  }

  _renderDataSection = () => {
    return (
      <div style={{ border: '1px solid #545454', padding: '1rem' }}>
        <div>TBD</div>
      </div>
    )
  }

  _renderRadioSection = () => {
    return (
      <div style={{ border: '1px solid #545454', padding: '1rem' }}>
        <div>TBD</div>
      </div>
    )
  }
}
