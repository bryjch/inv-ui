export class Item {
  name: string
  quantity: number
  dimensions: { w: number; h: number }
  position: { x: number; y: number }

  constructor(name: string, quantity: number, width: number, height: number) {
    this.name = name
    this.quantity = quantity
    this.dimensions = { w: width, h: height }
    this.position = { x: 0, y: 0 }
  }
}

export interface Quadrants {
  top: boolean
  left: boolean
  right: boolean
  bottom: boolean
}
