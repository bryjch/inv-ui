import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

const DEFAULT_FALLBACK = '/assets/misc/images/missing.png'

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

  componentDidUpdate(prevProps: ImageProps) {
    if (this.props.src !== prevProps.src) {
      this.setState({ src: this.props.src || '' })
    }
  }

  onError = () => {
    this.setState({ src: this.props.fallback || DEFAULT_FALLBACK })
  }

  render() {
    const { ...rest }: any = this.props

    return <motion.img {...rest} src={this.state.src} onError={this.onError} />
  }
}
