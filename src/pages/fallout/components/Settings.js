import React from 'react'
import { IoMdSettings, IoMdClose } from 'react-icons/io'
import { Checkbox, Segment } from 'semantic-ui-react'
import { useTransition, animated } from 'react-spring'

import { useStore, dispatch } from '@zus/store'
import { toggleUIPanelAction, updateSettingsOptionAction } from '@zus/actions'

//
// ─── SETTINGS ───────────────────────────────────────────────────────────────────
//

export const Settings = () => {
  const settings = useStore(state => state.settings)
  const isOpen = useStore(state => state.ui.activePanels.includes('SettingsPanel'))

  const toggleUIPanel = () => dispatch(toggleUIPanelAction('SettingsPanel'))
  const updateSettingsOption = (key, value) => dispatch(updateSettingsOptionAction(key, value))

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const transition = useTransition(isOpen, null, {
    from: { opacity: 0, right: '-0.5rem', position: 'absolute', width: 260, top: '0.5rem' },
    enter: { opacity: 1, right: '0.5rem' },
    leave: { opacity: 0, right: '-0.5rem', pointerEvents: 'none' },
  })

  return (
    <>
      <div id="settings">
        <div className="d-flex flex-column align-items-end">
          <IoMdSettings size={28} className="hover-icon" onClick={toggleUIPanel} />

          {transition.map(
            ({ item, key, props }) =>
              item && (
                <animated.div key={key} style={props}>
                  <Segment className="inverted">
                    <div className="close-btn-container">
                      <IoMdClose size={28} className="hover-icon" onClick={toggleUIPanel} />
                    </div>

                    <h5 className="mt-0 mb-2">SETTINGS</h5>

                    <h6 className="mt-4 mb-2">AUDIO</h6>

                    {/* Sounds enabled */}

                    <div
                      className="option"
                      onClick={() => updateSettingsOption('soundsEnabled', !settings.soundsEnabled)}
                    >
                      <span>Play sounds</span>
                      <Checkbox className="inverted" checked={settings.soundsEnabled} />
                    </div>

                    {/* Sounds volume */}

                    <div className="option">
                      <span>Volume</span>
                      <input
                        className="slider"
                        type="range"
                        value={settings.soundsVolume}
                        disabled={!settings.soundsEnabled}
                        min={0}
                        max={1}
                        step={0.1}
                        onChange={({ target }) =>
                          updateSettingsOption('soundsVolume', Number(target.value))
                        }
                      />
                    </div>

                    <h6 className="mt-4 mb-2">MISC</h6>

                    {/* Tilt enabled */}

                    <div
                      className="option"
                      onClick={() => updateSettingsOption('tiltEnabled', !settings.tiltEnabled)}
                    >
                      <span>Tilt hover effect</span>
                      <Checkbox className="inverted" checked={settings.tiltEnabled} />
                    </div>
                  </Segment>
                </animated.div>
              )
          )}
        </div>
      </div>

      <style jsx>{`
        #settings {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 1rem;
          color: #ffffff;
          font-size: 0.9rem;

          .close-btn-container {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
          }

          .option {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
            cursor: pointer;

            span {
              user-select: none;
            }

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      `}</style>
    </>
  )
}

export default Settings
