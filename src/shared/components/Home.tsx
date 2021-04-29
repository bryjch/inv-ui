import React, { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import { get } from 'lodash'

import { SoundManager, Sounds } from '@services/sounds'
import { AssetManager } from '@services/assets'

import { sleep } from '@utils/sleep'

const KITTY_PATS_REQUIRED = 3
const LOGO_SIZE = '64px'

export const Home = () => {
  const [pats, setPats] = useState(0)
  const [animating, setAnimating] = useState(false)

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    // Sounds are preloaded otherwise there is a noticable delay between
    // the first time a sound is triggered & when the audio actually plays
    // (due to audio file still being downloaded)
    SoundManager.preload(['MISC'])
    AssetManager.preload(['/assets/misc/images/bag.png', '/assets/misc/images/bagkitty.png'])
  }, [])

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const onClickBag = async () => {
    if (animating) return null

    const updatedPats = pats + 1

    await setPats(updatedPats)
    await setAnimating(true)

    if (updatedPats <= KITTY_PATS_REQUIRED) {
      const sound: string = get(Sounds.MISC, `BAG_SHUFFLE_${updatedPats}`, '')
      if (sound) SoundManager.play(sound)

      if (updatedPats === KITTY_PATS_REQUIRED) {
        await sleep(100)
        SoundManager.play(Sounds.MISC.MEOW, { volume: 1.3 })
      }
    }

    await sleep(500)
    await setAnimating(false)
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const logoCls = []
  if (pats >= KITTY_PATS_REQUIRED) logoCls.push('kitty breathing')
  else if (animating) logoCls.push('shaking')
  else logoCls.push('bouncing')

  return (
    <>
      <Helmet>
        <title>invUI // Home</title>
      </Helmet>

      <div id="home">
        <div className="panel">
          <div className={`logo ${logoCls.join(' ')}`} onClick={onClickBag}>
            {pats >= KITTY_PATS_REQUIRED ? (
              <img
                src="https://deploy-preview-4--invui.netlify.app/assets/misc/images/bagkitty.png"
                alt="invUI Logo Kitty!!!"
              />
            ) : (
              <img src="/assets/misc/images/bag.png" alt="invUI Logo" />
            )}
          </div>

          <div className="info">
            <div className="title">
              <span>inv</span>
              <span>UI</span>
            </div>

            <div className="description">
              Recreating game inventory UIs in the browser -
              <br />
              exploring their usability and design.
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import 'assets/css/mixins.scss';

        #home {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;

          .panel {
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            align-items: center;
            padding: 1rem;
            color: #ffffff;

            .logo {
              width: ${LOGO_SIZE};
              height: ${LOGO_SIZE};
              margin: 0 1rem;
              cursor: pointer;

              img {
                width: 100%;
                height: 100%;
                -webkit-user-drag: none;
                image-rendering: pixelated;
                animation: bounce 3s steps(2) 0s infinite forwards;
                @include filter-outline(1px, var(--main-accent-color));
              }

              &.kitty {
                cursor: default;
              }

              &.bouncing {
                img {
                  animation: bounce 2s steps(1) 0s infinite forwards;
                }
              }

              &.shaking {
                img {
                  animation: shake 0.1s linear 0s infinite alternate-reverse;
                }
              }

              &.breathing {
                img {
                  animation: reveal 0.3s steps(5) 0s 1 forwards,
                    breathe 1s steps(2) 0.3s infinite alternate-reverse;
                }
              }
            }

            .info {
              padding: 0 1rem 0.5rem 1rem;

              .title {
                font-size: 3rem;
                letter-spacing: 5px;

                span:nth-child(1) {
                  font-weight: 300;
                }

                span:nth-child(2) {
                  color: var(--main-accent-color);
                  font-weight: 900;
                }
              }

              .description {
                opacity: 0.8;
                line-height: 1.5;
              }
            }

            @include lt-md {
              flex-flow: column nowrap;
              text-align: center;
            }
          }
        }

        @keyframes reveal {
          0% {
            width: 100%;
          }
          20% {
            width: calc(${LOGO_SIZE} + 10px);
            height: calc(${LOGO_SIZE} + 10px);
            margin: -5px;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes bounce {
          0% {
            transform: translate(0px, 0px);
          }
          6% {
            transform: translate(0px, -3px);
          }
          9% {
            transform: translate(0px, 0px);
          }
          12% {
            transform: translate(0px, -3px);
          }
          15% {
            transform: translate(0px, 0px);
          }
        }

        @keyframes shake {
          0% {
            transform: translate(-2px, 0px);
          }
          100% {
            transform: translate(2px, 0px);
          }
        }

        @keyframes breathe {
          0% {
            margin-left: -2px;
            margin-top: -3px;
            width: calc(100% + 3px);
            height: calc(100% + 4px);
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </>
  )
}
