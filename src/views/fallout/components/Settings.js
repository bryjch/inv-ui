import React, { useState } from 'react'
import { connect } from 'react-redux'
import { IoMdSettings, IoMdClose } from 'react-icons/io'
import { Checkbox, Segment } from 'semantic-ui-react'
import { useSpring, animated } from 'react-spring'

const AnimatedSegment = animated(Segment)

const Settings = () => {
  const [menuVisible, setMenuVisibility] = useState(false)

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

let Menu = ({ settings, rdxUpdateSettingsOption }) => {
  const anim = useSpring({
    from: { top: -60, opacity: 0 },
    to: { top: 0, opacity: 1 },
  })

  return (
    <>
      <AnimatedSegment style={anim} className="inverted">
        <h6 className="mt-0 mb-2">SETTINGS</h6>

        <div
          className="option"
          onClick={rdxUpdateSettingsOption.bind(this, 'soundsEnabled', !settings.soundsEnabled)}
        >
          <Checkbox className="inverted" label="Play sounds" checked={settings.soundsEnabled} />
        </div>

        <div
          className="option"
          onClick={rdxUpdateSettingsOption.bind(this, 'tiltEnabled', !settings.tiltEnabled)}
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

const mapStateToProps = state => ({
  settings: state.settings,
})

const mapDispatchToProps = dispatch => ({
  rdxUpdateSettingsOption: (option, value) =>
    dispatch({ type: 'UPDATE_SETTINGS_OPTION', option, value }),
})

Menu = connect(mapStateToProps, mapDispatchToProps)(Menu)

export default Settings
