import { upperCase } from 'lodash'
import { IoClose, IoCubeOutline } from 'react-icons/io5'
import { useTransition, animated } from 'react-spring'

import { useStore, dispatch } from '@zus/store'
import { toggleUIPanelAction, updateSettingsOptionAction } from '@zus/actions'

//
// ─── SETTINGS ───────────────────────────────────────────────────────────────────
//

export const Settings = () => {
  const activeGame = useStore(state => state.app.activeGame)
  const settings = useStore(state => state.settings)
  const isOpen = useStore(state => state.ui.activePanels.includes('SettingsPanel'))

  const toggleUIPanel = () => dispatch(toggleUIPanelAction('SettingsPanel'))
  const updateSettingsOption = (key: string, value: any) =>
    dispatch(updateSettingsOptionAction(key, value))

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const transitions = useTransition(isOpen, {
    from: { opacity: 0, marginLeft: 50 },
    enter: { opacity: 1, marginLeft: 0 },
    leave: { opacity: 0, marginLeft: -50, pointerEvents: 'none' },
  })

  return (
    <>
      <div id="settings" className={isOpen ? 'open' : ''} onClick={toggleUIPanel}>
        {transitions(
          (props: any, item: any) =>
            item && (
              <animated.div
                style={props}
                className="panel"
                onClick={(e: any) => e.stopPropagation()}
              >
                <div className="close-btn-container hover-icon" onClick={toggleUIPanel}>
                  <IoClose size={28} />
                </div>

                {/********************* GAME SETTINGS *********************/}

                {activeGame && (
                  <div className="heading">
                    <img src={activeGame.image} alt={activeGame.name} />

                    <h4 className="m-0">{upperCase(activeGame.name)}</h4>
                  </div>
                )}

                {(() => {
                  if (!activeGame) return null

                  /////////////
                  // FALLOUT //
                  /////////////

                  switch (activeGame?.id) {
                    case 'fallout':
                      return (
                        <>
                          {/* Tilt enabled */}

                          <div
                            className="option"
                            onClick={() =>
                              updateSettingsOption(
                                'fallout.tiltEnabled',
                                !settings.fallout.tiltEnabled
                              )
                            }
                          >
                            <span>Tilt hover effect</span>
                            <input
                              readOnly
                              type="checkbox"
                              checked={settings.fallout.tiltEnabled}
                            />
                          </div>
                        </>
                      )

                    ///////////////
                    // MINECRAFT //
                    ///////////////

                    case 'minecraft':
                      return (
                        <>
                          {/* Tilt enabled */}

                          <div
                            className="option"
                            onClick={() =>
                              updateSettingsOption(
                                'minecraft.persistInventory',
                                !settings.minecraft.persistInventory
                              )
                            }
                          >
                            <span>Persist inventory after leaving page</span>
                            <input
                              readOnly
                              type="checkbox"
                              checked={settings.minecraft.persistInventory}
                            />
                          </div>
                        </>
                      )

                    default:
                      return null
                  }
                })()}

                {activeGame && <hr />}

                {/********************* GENERAL SETTINGS *********************/}

                <div className="heading">
                  <IoCubeOutline size={22} />

                  <h4 className="m-0">GENERAL</h4>
                </div>

                {/* Sounds enabled */}

                <div
                  className="option"
                  onClick={() =>
                    updateSettingsOption('general.soundsEnabled', !settings.general.soundsEnabled)
                  }
                >
                  <span>Play sounds</span>
                  <input type="checkbox" readOnly checked={settings.general.soundsEnabled} />
                </div>

                {/* Sounds volume */}

                <div className={`option ml-3 ${!settings.general.soundsEnabled ? 'disabled' : ''}`}>
                  <span>Volume</span>
                  <input
                    className="slider"
                    type="range"
                    value={settings.general.soundsVolume}
                    disabled={!settings.general.soundsEnabled}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={({ target }) =>
                      updateSettingsOption('general.soundsVolume', Number(target.value))
                    }
                  />
                </div>
              </animated.div>
            )
        )}
      </div>

      <style jsx>{`
        #settings {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          width: 100%;
          height: 100%;
          color: #ffffff;
          z-index: 11000;
          pointer-events: none;
          transition: 0.3s ease all;

          &.open {
            pointer-events: auto;
            background: rgba(0, 0, 0, 0.25);
          }

          .close-btn-container {
            position: absolute;
            top: 0.75rem;
            right: 0.75rem;
          }

          & > :global(.panel) {
            position: relative;
            width: 100%;
            max-width: 400px;
            margin-top: auto;
            margin-bottom: auto;
            padding: 1.5rem;
            background-color: rgba(32, 34, 37, 1);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            border-radius: 12px;
          }

          hr {
            margin: 1.5rem 0;
            opacity: 0.1;
          }

          .heading {
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            letter-spacing: 2px;
            margin-bottom: 1rem;

            & > :global(svg) {
              margin-right: 0.5rem;
            }

            img {
              width: 22px;
              height: 22px;
              image-rendering: -webkit-optimize-contrast;
              margin-right: 0.5rem;
            }
          }

          .option {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
            cursor: pointer;
            padding: 0.66rem 1rem;
            background-color: rgba(0, 0, 0, 0.15);
            border-left: 4px solid #3c4453;
            border-radius: 4px;

            &:hover {
              background-color: rgba(0, 0, 0, 0.3);
            }

            &.disabled {
              opacity: 0.5;
              pointer-events: none;
              border-color: rgba(255, 255, 255, 0.1);
            }

            span {
              user-select: none;
            }

            & > input[type='checkbox'] {
              transform: scale(1.5);
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
