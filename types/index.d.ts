export interface ZoomImageOptions {
  className?: string
  minWidth?: number
  duration?: number
  enableWheelScale?: boolean
  enableDragMove?: boolean
}

export as namespace ZoomImage
export default ZoomImage

declare class ZoomImage {
  constructor(options?: ZoomImageOptions)

  on(type: string, fn: () => void): ZoomImage

  off(type: string, fn: () => void): ZoomImage
}