import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

// https://png-pixel.com/
const PNG_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

export interface ImageProps extends HTMLMotionProps<'img'> {
  fallback?: string
}

export interface ImageState {
  src: string
}

export class Image extends React.Component<ImageProps, ImageState> {
  constructor(props: any) {
    super(props)

    this.state = {
      src: props.src,
    }
  }

  onError = () => {
    this.setState({ src: this.props.fallback || PNG_PIXEL })
  }

  render() {
    const { ...rest }: any = this.props

    return <motion.img {...rest} src={this.state.src} onError={this.onError} />
  }
}
