import React, { useState } from 'react'

import { jump } from './monogatari/helpers'

import { sleep } from '@utils'

const POOPY_SIZE = 64

const POOPY_FRAME_START = index => `${POOPY_SIZE * (-index + 1)}px`
const POOPY_FRAME_END = index => `${POOPY_SIZE * -index}px`

const POOPY_STATUS = {
  IDLE: 'idle',
  HURT: 'hurt',
  WORRIED: 'worried',
  SCARED: 'scared',
  TERRIFIED: 'terrified',
  DYING: 'dying',
  DEAD: 'dead',
}

const POOPY_MOVEMENT = {
  NONE: 'none',
  RUNNING: 'running',
  SPRINTING: 'sprinting',
  SLOW: 'slow',
}

const POOPY_MODIFIER = {
  NORMAL: 'normal',
  INVULNERABLE: 'invulnerable',
  FADING: 'fading',
}

export const Poopy = () => {
  const [timesClicked, setTimesClicked] = useState(0)
  const [status, setStatus] = useState(POOPY_STATUS.IDLE)
  const [movement, setMovement] = useState(POOPY_MOVEMENT.NONE)
  const [modifier, setModifier] = useState(POOPY_MODIFIER.NORMAL)

  const makeInvulnerable = async duration => {
    setModifier(POOPY_MODIFIER.INVULNERABLE)
    await sleep(duration)
    setModifier(POOPY_MODIFIER.NORMAL)
  }

  const onClickPoopy = count => async () => {
    if (modifier === POOPY_MODIFIER.INVULNERABLE) return false
    if (status === POOPY_STATUS.DEAD) return false

    await setTimesClicked(count)

    // Handle hurt animation and invulnerability

    if (count >= 3) {
      setStatus(POOPY_STATUS.HURT)
      await sleep(150)
    }

    if (count >= 18) {
      // Poopy is dead
    } else if (count >= 13) {
      makeInvulnerable(750)
    } else if (count >= 9) {
      makeInvulnerable(400)
    } else {
      makeInvulnerable(150)
    }

    // Escalating statuses

    if (count >= 3) {
      setStatus(POOPY_STATUS.WORRIED)
    }

    if (count >= 6) {
      setStatus(POOPY_STATUS.SCARED)
    }

    if (count >= 9) {
      setStatus(POOPY_STATUS.TERRIFIED)
      setMovement(POOPY_MOVEMENT.RUNNING)
    }

    if (count >= 11) {
      setMovement(POOPY_MOVEMENT.SPRINTING)
    }

    if (count >= 13) {
      setStatus(POOPY_STATUS.DYING)
      setMovement(POOPY_MOVEMENT.SLOW)
    }

    if (count >= 16) {
      setMovement(POOPY_MOVEMENT.NONE)
    }

    // Events at specific click counts

    if (count === 3) {
      jump('POOPY_WORRIED_1')
    }

    if (count === 6) {
      jump('POOPY_SCARED_1')
    }

    if (count === 8) {
      jump('POOPY_TERRIFIED_1')
    }

    if (count === 10) {
      jump('POOPY_TERRIFIED_2')
    }

    if (count === 11) {
      jump('POOPY_TERRIFIED_3')
    }

    if (count === 13) {
      jump('POOPY_TERRIFIED_4')
    }

    if (count === 15) {
      jump('POOPY_DYING_1')
    }

    if (count === 18) {
      setStatus(POOPY_STATUS.HURT)
      setModifier(POOPY_MODIFIER.FADING)
      await sleep(3000)
      setModifier(POOPY_MODIFIER.NORMAL)
      await sleep(2000)

      setStatus(POOPY_STATUS.DEAD)
    }
  }

  return (
    <>
      <div className={`modifier ${modifier}`}>
        <div className={`mover ${movement}`}>
          <div className={`poopy ${status}`} onClick={onClickPoopy(timesClicked + 1)} />
        </div>
      </div>

      <style jsx>{`
        .modifier {
          &.${POOPY_MODIFIER.INVULNERABLE} {
            animation: modifier-invulnerable 0.05s infinite alternate;
          }
          &.${POOPY_MODIFIER.FADING} {
            animation: modifier-fading 0.25s steps(3) 7 alternate;
          }
        }

        .mover {
          &.${POOPY_MOVEMENT.RUNNING} {
            animation: mover-running 1s linear infinite;
          }

          &.${POOPY_MOVEMENT.SPRINTING} {
            animation: mover-running 0.66s linear infinite;
          }

          &.${POOPY_MOVEMENT.SLOW} {
            animation: mover-running 8s linear infinite;
          }
        }

        .poopy {
          width: ${POOPY_SIZE}px;
          height: ${POOPY_SIZE}px;
          background: transparent url('/monogatari/characters/poopy.png') 0 0 no-repeat;
          background-size: cover;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
          cursor: pointer;

          &.${POOPY_STATUS.IDLE} {
            animation: poopy-idle 2s steps(2) infinite;
          }

          &.${POOPY_STATUS.HURT} {
            animation: poopy-hurt 0.5s steps(1) infinite;
          }

          &.${POOPY_STATUS.WORRIED} {
            animation: poopy-idle 0.5s steps(2) infinite;
          }

          &.${POOPY_STATUS.SCARED} {
            animation: poopy-idle 0.2s steps(2) infinite;
          }

          &.${POOPY_STATUS.TERRIFIED} {
            animation: poopy-idle 0.1s steps(2) infinite;
          }

          &.${POOPY_STATUS.DYING} {
            animation: poopy-dying 3s steps(2) infinite;
          }

          &.${POOPY_STATUS.DEAD} {
            animation: poopy-dead 1s steps(1) infinite;
          }
        }

        @keyframes modifier-invulnerable {
          0% {
            opacity: 0.01;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes modifier-fading {
          0% {
            opacity: 0.4;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes mover-running {
          0%,
          1% {
            transform: translateX(0px) rotateY(180deg);
          }

          24% {
            transform: translateX(${POOPY_SIZE * -0.5}px) rotateY(180deg);
          }
          25% {
            transform: translateX(${POOPY_SIZE * -0.5}px) rotateY(0deg);
          }

          49%,
          50% {
            transform: translateX(0px) rotateY(0deg);
          }

          74% {
            transform: translateX(${POOPY_SIZE * 0.5}px) rotateY(0deg);
          }
          75% {
            transform: translateX(${POOPY_SIZE * 0.5}px) rotateY(180deg);
          }

          99%,
          100% {
            transform: translateX(0px) rotateY(180deg);
          }
        }

        @keyframes poopy-idle {
          0% {
            background-position-x: ${POOPY_FRAME_START(2)};
          }
          100% {
            background-position-x: ${POOPY_FRAME_END(3)};
          }
        }

        @keyframes poopy-hurt {
          0% {
            background-position-x: ${POOPY_FRAME_START(5)};
          }
          100% {
            background-position-x: ${POOPY_FRAME_END(5)};
          }
        }

        @keyframes poopy-dying {
          0% {
            background-position-x: ${POOPY_FRAME_START(7)};
          }
          100% {
            background-position-x: ${POOPY_FRAME_END(8)};
          }
        }

        @keyframes poopy-dead {
          0% {
            background-position-x: ${POOPY_FRAME_START(10)};
          }
          100% {
            background-position-x: ${POOPY_FRAME_END(10)};
          }
        }
      `}</style>
    </>
  )
}
