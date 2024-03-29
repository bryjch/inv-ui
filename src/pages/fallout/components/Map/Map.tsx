import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { MapInteractionCSS } from 'react-map-interaction'
import { isEqual, throttle } from 'lodash'

import { SoundManager, Sounds } from '@services/sounds'

import mapLocations from '../../data/mapLocations.json'

export const Map = () => {
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

  const playZoomSound = throttle(() => SoundManager.play(Sounds.FALLOUT.MAP_ZOOM), 20, {
    leading: true,
    trailing: false,
  })

  const playPanSound = throttle(() => SoundManager.play(Sounds.FALLOUT.MAP_PAN), 30, {
    leading: true,
    trailing: false,
  })

  const onMapChange = (newState: any) => {
    // If user makes any SCALING gestures
    if (!isEqual(newState.scale, bounds.scale)) {
      playZoomSound()
    }

    // If user makes any PANNING gestures
    else if (!isEqual(newState.translation, bounds.translation)) {
      // This ensures the pan sound will only trigger every 20 pixels translated
      const roundToStep = (x: number) => Math.ceil(x / 20) * 20
      const xPan = roundToStep(newState.translation.x) !== roundToStep(bounds.translation.x)
      const yPan = roundToStep(newState.translation.y) !== roundToStep(bounds.translation.y)
      if (xPan || yPan) playPanSound()
    }

    setBounds({ ...bounds, ...newState })
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div className="map-container" ref={containerRef}>
      <MapInteractionCSS
        translationBounds={{ xMin: bounds.xMin, xMax: 0, yMin: bounds.yMin, yMax: 0 }}
        maxScale={2}
        minScale={bounds.minScale}
        value={bounds}
        onChange={onMapChange}
        onCl
      >
        <img
          src="/assets/fallout/images/map_mojave.jpg"
          alt="Fallout Map Mojave"
          ref={imgRef}
          onLoad={() => setImgLoaded(true)}
        />

        <Locations />
      </MapInteractionCSS>

      <style jsx>{`
        .map-container {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}

export const Locations = () => {
  return (
    <div className="locations">
      {mapLocations.map((location, index) => (
        <Location key={`map-location-${index}`} {...location} />
      ))}

      <style jsx>{`
        .locations {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }
      `}</style>
    </div>
  )
}

export const Location = ({
  name,
  image,
  x,
  y,
}: {
  name: string
  image: string
  x: number
  y: number
}) => {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div
      className="location"
      style={{ left: x, top: y, backgroundImage: `url(${image})` }}
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      {showInfo && <div className="info">{name}</div>}

      <style jsx>{`
        .location {
          position: absolute;
          width: 17px;
          height: 17px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          background-size: cover;
          transition: 0.1s ease all;
          border-radius: 1px;

          &:hover {
            transform: scale(1.2);
          }

          .info {
            position: absolute;
            bottom: 20px;
            background: #000000;
            color: #ffcd00;
            padding: 0.3rem 0.5rem;
            font-size: 0.9rem;
            line-height: 1;
            border-radius: 2px;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  )
}
