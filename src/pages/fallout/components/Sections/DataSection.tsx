import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { MapInteractionCSS } from 'react-map-interaction'
import { isEqual, throttle } from 'lodash'

import { SoundManager, Sounds } from '@services/sounds'
import { hexToRgba } from '@utils/styling'

//
// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
//

export const DataSectionTabs = [{ name: 'quests' }, { name: 'map' }, { name: 'journal' }]

//
// ─── DEFINITION ─────────────────────────────────────────────────────────────────
//

interface DataSectionProps {
  tab: string
}

export const DataSection = (props: DataSectionProps) => {
  const { tab } = props

  return (
    <section id="data-section">
      {(() => {
        switch (tab) {
          case 'quests':
            return <QuestsTab />

          case 'map':
            return <MapTab />

          case 'journal':
            return <JournalTab />

          default:
            return null
        }
      })()}

      <style jsx>{`
        #data-section {
          display: flex;
          flex-flow: column nowrap;
          flex: 1;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}

const QuestsTab = () => {
  return <div id="quests-tab">Quests</div>
}

const MapTab = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [containerDimensions, setContainerDimensions] = useState({ x: 0, y: 0 })
  const [imgDimensions, setImgDimensions] = useState({ x: 0, y: 0 })
  const [bounds, setBounds] = useState({
    scale: 0,
    translation: { x: 0, y: 0 },
    minScale: 1,
    xMin: 0,
    yMin: 0,
  })

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useLayoutEffect(() => {
    if (!!containerRef.current) {
      setContainerDimensions({
        x: containerRef.current.offsetWidth,
        y: containerRef.current.offsetHeight,
      })
    }
  }, [containerRef])

  useEffect(() => {
    if (!!imgRef.current) {
      setImgDimensions({
        x: imgRef.current.naturalWidth,
        y: imgRef.current.naturalHeight,
      })
    }
  }, [imgLoaded])

  useEffect(() => {
    if (containerDimensions.x === 0) return
    if (imgDimensions.x === 0) return

    // Make sure the map will always fill the container's width
    const minScale = containerDimensions.x / imgDimensions.x
    let scale = bounds.scale

    // Handle initial scale of 0 (this is necessary to handle unloaded image)
    if (scale === 0) scale = minScale

    // Make sure user can't translate beyond the dimensions of the image
    const xMin = containerDimensions.x - imgDimensions.x * scale
    const yMin = containerDimensions.y - imgDimensions.y * scale

    setBounds({
      ...bounds,
      scale: scale,
      minScale: minScale,
      xMin: xMin,
      yMin: yMin,
    })
  }, [bounds.scale, containerDimensions, imgDimensions]) // eslint-disable-line react-hooks/exhaustive-deps

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const playZoomSound = useCallback(
    throttle(() => SoundManager.play(Sounds.FALLOUT.MAP_ZOOM), 20, {
      leading: true,
      trailing: false,
    }),
    []
  )

  const playPanSound = useCallback(
    throttle(() => SoundManager.play(Sounds.FALLOUT.MAP_PAN), 30, {
      leading: true,
      trailing: false,
    }),
    []
  )

  const onMapChange = (newState: any) => {
    // If user makes any SCALING gestures
    if (!isEqual(newState.scale, bounds.scale)) {
      playZoomSound()
    }
    // If user makes any PANNING gestures
    else if (!isEqual(newState.translation, bounds.translation)) {
      playPanSound()
    }

    setBounds({ ...bounds, ...newState })
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <>
      <div id="map-tab" ref={containerRef}>
        <MapInteractionCSS
          translationBounds={{ xMin: bounds.xMin, xMax: 0, yMin: bounds.yMin, yMax: 0 }}
          maxScale={2}
          minScale={bounds.minScale}
          value={bounds}
          onChange={onMapChange}
        >
          <img
            src="/fallout/images/map_mojave.jpg"
            alt="Fallout Map Mojave"
            ref={imgRef}
            onLoad={() => setImgLoaded(true)}
          />
        </MapInteractionCSS>

        <style jsx>{`
          #map-tab {
            width: 100%;
            height: 100%;
            border: 1px solid ${hexToRgba('#92aad8', 0.33)};
          }
        `}</style>
      </div>
    </>
  )
}

const JournalTab = () => {
  return <div id="journal-tab">Journal</div>
}
