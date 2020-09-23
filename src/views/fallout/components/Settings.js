import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IoMdSettings, IoMdClose } from 'react-icons/io'
import { Checkbox, Segment } from 'semantic-ui-react'
import { useSpring, animated } from 'react-spring'

import { loadSettingsAction, updateSettingsOptionAction } from '@redux/actions'

const AnimatedSegment = animated(Segment)

export const Settings = () => {
  const [menuVisible, setMenuVisibility] = useState(false)

  const dispatch = useDispatch()
  const loadSettings = useCallback(() => dispatch(loadSettingsAction()), [dispatch])

  useEffect(loadSettings, [])

  return (
    <>
      <div id="settings">
        {!menuVisible ? (
          <IoMdSettings
            size={28}
            className="hover-icon"
            onClick={setMenuVisibility.bind(this, true)}
          />
        ) : (
          <div className="d-flex flex-column align-items-end">
            <IoMdClose
              size={28}
              className="hover-icon"
              onClick={setMenuVisibility.bind(this, false)}
            />

            <Menu />
          </div>
        )}
      </div>

      <style jsx>{`
        #settings {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 1rem;
          color: #ffffff;
          font-size: 0.9rem;

          .option {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            margin-bottom: 1rem;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      `}</style>
    </>
  )
}

export const Menu = () => {
  const anim = useSpring({
    from: { top: -60, opacity: 0 },
    to: { top: 0, opacity: 1 },
  })

  const dispatch = useDispatch()
  const settings = useSelector(state => state.settings)
  const togglePlayback = useCallback(
    (key, value) => dispatch(updateSettingsOptionAction(key, value)),
    [dispatch]
  )

  return (
    <>
      <AnimatedSegment style={anim} className="inverted">
        <h6 className="mt-0 mb-2">SETTINGS</h6>

        <div
          className="option"
          onClick={togglePlayback.bind(this, 'soundsEnabled', !settings.soundsEnabled)}
        >
          <Checkbox className="inverted" label="Play sounds" checked={settings.soundsEnabled} />
        </div>

        <div
          className="option"
          onClick={togglePlayback.bind(this, 'tiltEnabled', !settings.tiltEnabled)}
        >
          <Checkbox className="inverted" label="Tilt hover effect" checked={settings.tiltEnabled} />
        </div>
      </AnimatedSegment>

      <style jsx>{`
        .option {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          margin-bottom: 0.5rem;

          &:last-child {
            margin-bottom: 0;
          }
        }
      `}</style>
    </>
  )
}

export default Settings
