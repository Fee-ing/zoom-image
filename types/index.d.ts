export as namespace ZoomImage
export default ZoomImage

interface ZoomImageOptions {
  className?: string
  minWidth?: number
  duration?: number
  enableWheelScale?: boolean
  enableDragMove?: boolean
}

declare class ZoomImage {
  constructor(options?: ZoomImageOptions)

  on(type: string, fn: () => void): ZoomImage

  off(type: string, fn: () => void): ZoomImage
}