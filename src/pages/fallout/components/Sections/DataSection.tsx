import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { MapInteractionCSS } from 'react-map-interaction'

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

    if (!!imgRef.current) {
      setImgDimensions({
        x: imgRef.current.naturalWidth,
        y: imgRef.current.naturalHeight,
      })
    }
  }, [containerRef, imgRef])

  useEffect(() => {
    // Make sure the map will always fill the container's width
    const minScale = containerDimensions.x / imgDimensions.x

    // Make sure user can't translate beyond the dimensions of the image
    const xMin = containerDimensions.x - imgDimensions.x * bounds.scale
    const yMin = containerDimensions.y - imgDimensions.y * bounds.scale

    setBounds({
      ...bounds,
      scale: bounds.scale || minScale, // Handle initial scale of 0
      minScale: minScale,
      xMin: xMin,
      yMin: yMin,
    })
  }, [bounds.scale, containerDimensions, imgDimensions]) // eslint-disable-line react-hooks/exhaustive-deps

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
          onChange={(value: any) => setBounds({ ...bounds, ...value })}
        >
          <img src="/fallout/images/map_mojave.jpg" alt="Fallout Map Mojave" ref={imgRef} />
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
