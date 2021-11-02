class ZoomImage {

  constructor (options = {}) {
    this.options = { className: 'zoom-image', ...options }

    this.imageSrc = ''
    this.srcType = ''
    this.originWidth = 0
    this.originHeight = 0
    this.zoomWidth = 0
    this.zoomHeight = 0
    this.offsetLeft = 0
    this.offsetTop = 0
    this.scrollLeft = 0
    this.scrollTop = 0
    this.startCss = ''
    this.endCss = ''
    this.transitionFlag = false

    this.listeners = {}

    this.init()
  }

  on (type, fn) {
    if (typeof this.listeners[type] === 'undefined') {
      this.listeners[type] = []
    }
    if (typeof fn === 'function') {
      this.listeners[type].push(fn)
    }    
    return this
  }

  off (type, fn) {
    let arrayEvent = this.listeners[type]
    if (typeof type === 'string' && arrayEvent instanceof Array) {
      if (typeof fn === 'function') {
        for (let i = 0, length = arrayEvent.length; i < length; i += 1) {
          if (arrayEvent[i] === fn) {
            this.listeners[type].splice(i, 1)
            break
          }
        }
      } else {
        delete this.listeners[type]
      }
    }
    return this
  }

  emit (type, opts = {}) {
    let arrayEvent = this.listeners[type]
    if (arrayEvent instanceof Array) {
      for (let i = 0, length = arrayEvent.length; i < length; i += 1) {
        if (typeof arrayEvent[i] === 'function') {
          arrayEvent[i]({ type, ...opts }) 
        }
      }
    }
    return this
  }

  getElementLeft (element) {
    this.offsetLeft += element.offsetLeft || 0
    if (element.offsetParent) {
      return this.getElementLeft(element.offsetParent)
    } else {
      return this.offsetLeft
    }
  }

  getElementTop (element) {
    this.offsetTop += element.offsetTop || 0
    if (element.offsetParent) {
      return this.getElementTop(element.offsetParent)
    } else {
      return this.offsetTop
    }
  }

  getScrollLeft (element) {
    this.scrollLeft += element.scrollLeft || 0
    if (element.parentNode) {
      return this.getScrollLeft(element.parentNode)
    } else {
      return this.scrollLeft
    }
  }

  getScrollTop (element) {
    this.scrollTop += element.scrollTop || 0
    if (element.parentNode) {
      return this.getScrollTop(element.parentNode)
    } else {
      return this.scrollTop
    }
  }

  getElementCss (element, attr) {
    if ('getComputedStyle' in window) {
      return window.getComputedStyle(element, null)[attr]
    } else {
      return element.currentStyle[attr]
    }
  }

  createImageElement (src, callback) {
    let image = new Image()
    image.src = src
    if (image.complete) {
      callback && callback(image)
    } else {
      image.onload = function () {
        callback && callback(image)
        image.onload = null
      }

      let that = this
      image.onerror = function () {
        that.emit('error', { message: '获取图片失败' })
        image = null
      }
    }
  }

  reset () {
    this.imageSrc = ''
    this.zoomWidth = 0
    this.zoomHeight = 0
    this.originWidth = 0
    this.originHeight = 0
    this.offsetLeft = 0
    this.offsetTop = 0
    this.scrollLeft = 0
    this.scrollTop = 0
    this.startCss = ''
    this.endCss = ''
    this.transitionFlag = false
  }

  init () {
    const that = this
    document.onclick = function (e) {
      const target = e.target
      if (target.className.indexOf(that.options.className) < 0) return

      that.reset()

      if (target.src) {
        that.imageSrc = target.src
        that.srcType = '1'
      } else {
        that.imageSrc = that.getElementCss(target, 'background-image')
        if (that.imageSrc) {
          that.imageSrc = that.imageSrc.replace(/(^url\(('|"){1})|(('|"){1}\)$)/g, '')
          that.srcType = '2'
        }
      }
      if (!that.imageSrc) {
        that.emit('error', { message: '获取图片失败' })
        return
      }

      that.createImageElement(that.imageSrc, image => {
        const clientWidth = document.documentElement.clientWidth || document.body.clientWidth
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight

        that.offsetLeft = that.getElementLeft(target)
        that.offsetTop = that.getElementTop(target)
        that.scrollLeft = that.getScrollLeft(target)
        that.scrollTop = that.getScrollTop(target)
        that.offsetLeft -= that.scrollLeft
        that.offsetTop -= that.scrollTop
        that.originWidth = target.offsetWidth
        that.originHeight = target.offsetHeight
        that.zoomWidth = image.width
        that.zoomHeight = image.height
        const times = image.width / image.height
        if (that.zoomWidth > clientWidth * 0.9) {
          that.zoomWidth = clientWidth * 0.9
          that.zoomHeight = that.zoomWidth / times
        }
        if (that.zoomHeight > clientHeight * 0.9) {
          that.zoomHeight = clientHeight * 0.9
          that.zoomWidth = that.zoomHeight * times
        }

        let imageElement = null
        if (that.srcType === '1') {
          imageElement = image
        } else if (that.srcType === '2') {
          imageElement = document.createElement('div')
          that.startCss += `
            position: relative;
            overflow: hidden;
            background-image: url(${that.imageSrc});
            background-size: ${that.getElementCss(target, 'background-size')};
            background-position: ${that.getElementCss(target, 'background-position')};
            background-repeat: no-repeat;
          `
          image.style.cssText += `
            position: absolute;
            left: 0px;
            top: 0px;
            width: 100%;
            height: 100%;
            opacity: 0;
          `
          imageElement.appendChild(image)
        }
        that.startCss += `
          position: absolute;
          width: ${that.originWidth}px;
          height: ${that.originHeight}px;
          left: ${that.offsetLeft}px;
          top: ${that.offsetTop}px;
          transition: all 0.3s;
          transform: translate3d(0, 0, 0);
        `
        imageElement.style.cssText += that.startCss

        let mask = document.createElement('div')
        mask.style.cssText += `
          position: fixed;
          top: 0px;
          left: 0px;
          z-index: 1001;
          width: 100%;
          height: 100%;
          overflow: hidden;
          transition: all 0.3s;
          transform: translate3d(0, 0, 0);
        `
        mask.appendChild(imageElement)
        document.body.appendChild(mask)

        setTimeout(() => {
          mask.style.backgroundColor = 'rgba(0, 0, 0, 0.55)'

          that.endCss += `
            width: ${that.zoomWidth}px;
            height: ${that.zoomHeight}px;
            left: ${(clientWidth - that.zoomWidth) / 2}px;
            top: ${(clientHeight - that.zoomHeight) / 2}px;
          `
          imageElement.style.cssText += that.endCss
        })

        imageElement.onclick = function (event) {
          event.stopPropagation()
        }
        
        mask.onclick = function (event) {
          event.stopPropagation()
          mask.style.backgroundColor = ''
  
          imageElement.style.cssText += that.startCss
        }

        mask.addEventListener('transitionend', function (e) {
          if (e.propertyName === 'background-color') {
            if (that.transitionFlag) {
              document.body.removeChild(mask)
              mask = null
              imageElement = null
              image = null
              that.transitionFlag = false
            } else {
              that.transitionFlag = true
            }
          }
        }, false)
      })
    }
  }
}

export default ZoomImage
