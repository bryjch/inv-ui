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
    from: { opacity: 0, right: '-0.5rem', position: 'absolute', width: 200, top: '0.5rem' },
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

                    <h6 className="mt-0 mb-2">SETTINGS</h6>

                    {/* Sounds enabled */}

                    <div
                      className="option"
                      onClick={updateSettingsOption.bind(
                        this,
                        'soundsEnabled',
                        !settings.soundsEnabled
                      )}
                    >
                      <Checkbox
                        className="inverted"
                        label="Play sounds"
                        checked={settings.soundsEnabled}
                      />
                    </div>

                    {/* Tilt enabled */}

                    <div
                      className="option"
                      onClick={updateSettingsOption.bind(
                        this,
                        'tiltEnabled',
                        !settings.tiltEnabled
                      )}
                    >
                      <Checkbox
                        className="inverted"
                        label="Tilt hover effect"
                        checked={settings.tiltEnabled}
                      />
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
            align-items: center;
            margin-bottom: 0.5rem;

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
