import React, { useRef, useState, useEffect } from 'react'
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import moment from 'moment'

import { getContrastColor } from '@utils/styling'

const LOOP_CHECK_INTERVAL = 10 // ms

export interface HoldButtonProps {
  size?: number
  color?: string
  duration?: number
  progress?: {
    color: string
    width: number
  }
  disabled?: boolean
  onComplete?: () => any
  children?: React.ReactNode
}

export const HoldButton = (props: HoldButtonProps) => {
  const {
    size = 32,
    color = 'rgba(0, 0, 0, 0.3)',
    duration = 500,
    progress = { color: '#ffffff', width: 4 },
    onComplete = () => null,
    disabled = false,
  } = props

  const startAt = useRef(0)
  const loop = useRef<NodeJS.Timeout | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const holdDuration = useMotionValue(0)
  const yRange = useTransform(holdDuration, [0, duration * 0.95], [0, 1])
  const pathLength = useSpring(yRange, { duration: LOOP_CHECK_INTERVAL })

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    yRange.onChange(value => setIsComplete(value >= 1))
  }, [yRange])

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    if (disabled) return false

    startAt.current = moment().valueOf()

    loop.current = setInterval(() => {
      const millis = moment().valueOf() - startAt.current
      if (millis < duration) holdDuration.set(millis)
    }, LOOP_CHECK_INTERVAL)
  }

  const onMouseUp = (event: React.MouseEvent) => {
    event.preventDefault()
    if (disabled) return false

    // Trigger callback
    if (isComplete) onComplete()

    onMouseLeave()
  }

  const onMouseLeave = () => {
    if (disabled) return false

    holdDuration.set(0)
    setIsComplete(false)

    if (loop.current) {
      clearInterval(loop.current)
      loop.current = null
      holdDuration.set(0)
    }
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const cls = []
  if (isComplete) cls.push('complete')
  if (disabled) cls.push('disabled')

  return (
    <div
      className={`hold-button ${cls.join(' ')}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onContextMenu={(event: React.MouseEvent) => event.preventDefault()}
    >
      <motion.div className="content">{props.children}</motion.div>

      <svg className="progress" viewBox="0 0 50 50">
        <motion.path
          fill="none"
          strokeWidth={progress.width}
          stroke={progress.color}
          strokeDasharray="0 1"
          d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
          style={{
            pathLength: pathLength,
            rotate: 90,
            translateX: 5,
            translateY: 5,
            scaleX: -1,
          }}
        />
      </svg>

      <style jsx>{`
        .hold-button {
          position: relative;
          width: ${size}px;
          height: ${size}px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          border-radius: 50%;
          color: #ffffff;
          background-color: ${color};
          opacity: 0.7;
          transition: 0.2s ease all;

          & > :global(.content) {
            display: inline-block;
            line-height: 0;
          }

          .progress {
            position: absolute;
            top: ${-progress.width}px;
            left: ${-progress.width}px;
            width: ${size + progress.width * 2}px;
            height: ${size + progress.width * 2}px;
            pointer-events: none;
          }

          &:hover {
            opacity: 1;
          }

          &.complete {
            transform: scale(1.05);
            background-color: ${progress.color};
            color: ${getContrastColor(progress.color)};
          }

          &.disabled {
            opacity: 0.7;
            cursor: default;
          }
        }
      `}</style>
    </div>
  )
}
