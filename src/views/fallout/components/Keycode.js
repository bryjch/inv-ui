import React from 'react'
import Anime from 'react-anime'

export class Keycode extends React.Component {
  constructor() {
    super()

    // Reference to the wrapping Anime to manually call play()
    this.animeRef = null

    // this.animeRef.anime doesn't quite seem to update 'completed' and 'paused'
    // values reliably, so we manually keep track of it
    this.animeCompleted = true
  }

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  jiggle = async callback => {
    try {
      if (this.animeCompleted) {
        this.animeRef.anime.play()
      }

      await callback({ animating: !this.animeCompleted && !this.animeRef.anime.paused })

      // If another animation is triggered in the middle of an existing one,
      // the existing one gets "paused", which causes the animation to
      // get stuck, so we need to manually re-play it
      if (this.animeRef.anime.paused) {
        this.animeRef.anime.play()
      }
    } catch (error) {
      console.error(error)
    }
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  render() {
    const { value, style, animeProps } = this.props

    return (
      <Anime
        ref={el => (this.animeRef = el)}
        easing="easeInOutQuad"
        direction="alternate"
        translateY={[0, 2]}
        opacity={[0.4, 1]}
        autoplay={false}
        duration={75}
        {...animeProps}
        begin={() => (this.animeCompleted = false)}
        complete={() => (this.animeCompleted = true)}
      >
        <div className="keycode" style={style}>
          <div className="value">{value}</div>

          <style jsx>{`
            .keycode {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 1.2rem;
              height: 1.2rem;
              line-height: 1.2rem;
              font-size: 0.8rem;
              border: 1px solid #ffffff;
              border-radius: 0.25rem;
              user-select: none;
            }
          `}</style>
        </div>
      </Anime>
    )
  }
}
