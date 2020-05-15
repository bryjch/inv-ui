import React from 'react'
import _ from 'lodash'
import Tilt from 'react-tilt'
import { connect } from 'react-redux'
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

// Unfortunately react-tilt doesn't have an option to dynamically toggle the active state after
// the first time render --- and changing the {option} prop doesn't update the component.
// So, in order to have the {tiltEnabled} option work, we need to make the entire <Tilt> wrapper
// conditional. This <Div> acts as the wrapper when we want to DISABLE tilt effect.
const Div = ({ className, children }) => <div className={className}>{children}</div>

class Viewport extends React.Component {
  constructor() {
    super()

    this.state = {
      items: [...weapons, ...apparel, ...aid, ...misc, ...weapons, ...apparel, ...aid, ...misc],

      section: 'item', // 'stat',
      tab: 'all', // 'status',
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
    const { tiltEnabled } = this.props

    let WrapperComponent = Div
    if (tiltEnabled) WrapperComponent = Tilt

    return (
      <WrapperComponent className="tilt-container" options={{ max: 10, scale: 1.03 }}>
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
      </WrapperComponent>
    )
  }

  _renderStatSection = () => {
    const { tab } = this.state

    return (
      <section id="stat-section">
        {tab === 'status' && (
          <div id="status">
            <div>
              <h1>
                <span style={{ fontWeight: 300 }}>INVENTORY</span> UI
              </h1>
            </div>

            <img className="vaultboy" src="/fallout/images/vaultboy.gif" alt="Vault Boy" />
          </div>
        )}

        <style jsx>{`
          #stat-section {
            // border: 1px solid #545454;
            padding: 1rem;

            #status {
              display: flex;
              justify-content: center;
              align-items: center;

              .vaultboy {
                width: 400px;
                height: auto;
              }
            }
          }
        `}</style>
      </section>
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
      <section id="item-section">
        <InventoryViewer items={itemsFiltered} />
        <InventoryStatus items={items} onPressSort={() => console.log('SORT')} />

        <style jsx>{`
          #item-section {
            display: flex;
            flex-flow: column nowrap;
            flex: 1;
            overflow: hidden;
          }
        `}</style>
      </section>
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

const mapStateToProps = state => ({
  tiltEnabled: state.settings.tiltEnabled,
})

Viewport = connect(mapStateToProps)(Viewport)

export default Viewport
