(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.ZoomImage = factory())
}(this, (function () {
  'use strict'

  class ZoomImage {
    constructor (options = {}) {
      this.options = {
        className: 'zoom-image',
        minWidth: 100,
        duration: 0.3,
        ...options
      }
  
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
          // 清除当前type类型事件下对应fn方法
          for (let i = 0, length = arrayEvent.length; i < length; i += 1) {
            if (arrayEvent[i] === fn) {
              this.listeners[type].splice(i, 1)
              break
            }
          }
        } else {
          // 如果仅仅参数type, 或参数fn邪魔外道，则所有type类型事件清除
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
  
        that.createImageElement(that.imageSrc, imageElement => {
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
  
          const times = imageElement.width / imageElement.height
          that.zoomWidth = imageElement.width < that.minWidth ? that.minWidth : imageElement.width
          that.zoomHeight = that.zoomWidth / times
          if (that.zoomWidth > clientWidth * 0.9) {
            that.zoomWidth = clientWidth * 0.9
            that.zoomHeight = that.zoomWidth / times
          }
          if (that.zoomHeight > clientHeight * 0.9) {
            that.zoomHeight = clientHeight * 0.9
            that.zoomWidth = that.zoomHeight * times
          }
  
          let zoomElement = null, shadowElement = null
          if (that.srcType === '1') {
            zoomElement = imageElement
          } else if (that.srcType === '2') {
            zoomElement = document.createElement('div')
            shadowElement = document.createElement('div')
  
            shadowElement.style.cssText += `
              position: absolute;
              left: 0px;
              top: 0px;
              z-index: 1;
              width: 100%;
              height: 100%;
              opacity: 1;
              transition: opacity ${that.duration}s;
              background-repeat: no-repeat;
              background-image: url(${that.imageSrc});
              background-size: ${that.getElementCss(target, 'background-size')};
              background-position: ${that.getElementCss(target, 'background-position')};
            `
            imageElement.style.cssText += `
              position: absolute;
              left: 0px;
              top: 0px;
              z-index: 2;
              width: 100%;
              height: 100%;
              opacity: 0;
              transition: opacity ${that.duration}s;
            `
            zoomElement.appendChild(shadowElement)
            zoomElement.appendChild(imageElement)
          }
          zoomElement.style.cssText += `
            position: absolute;
            width: ${that.originWidth}px;
            height: ${that.originHeight}px;
            left: ${that.offsetLeft}px;
            top: ${that.offsetTop}px;
            transition: transform ${that.duration}s;
            overflow: hidden;
          `
  
          let maskElement = document.createElement('div')
          maskElement.style.cssText += `
            position: fixed;
            top: 0px;
            left: 0px;
            z-index: 1001;
            width: 100%;
            height: 100%;
            overflow: hidden;
            transition: background-color ${that.duration}s;
            transform: translate3d(0, 0, 0);
          `
          maskElement.appendChild(zoomElement)
          document.body.appendChild(maskElement)
  
          setTimeout(() => {
            maskElement.style.cssText += 'background-color: rgba(0, 0, 0, 0.55);'
  
            zoomElement.style.cssText += `
              transform: translate(${clientWidth / 2 - (that.offsetLeft + that.originWidth / 2)}px, ${clientHeight / 2 - (that.offsetTop + that.originHeight / 2)}px) scale(${that.zoomWidth / that.originWidth}, ${that.zoomHeight / that.originHeight});
            `
            if (that.srcType === '2') {
              shadowElement.style.cssText += `
                opacity: 0;
              `
              imageElement.style.cssText += `
                opacity: 1;
              `
            }
          })
          
          maskElement.onclick = function (event) {
            event.stopPropagation()
            maskElement.style.backgroundColor = ''
    
            zoomElement.style.cssText += `
              transform: none;
            `
            if (that.srcType === '2') {
              shadowElement.style.cssText += `
                opacity: 1;
              `
              imageElement.style.cssText += `
                opacity: 0;
              `
            }
          }
  
          maskElement.addEventListener('transitionend', function (e) {
            if (e.propertyName === 'background-color') {
              if (that.transitionFlag) {
                document.body.removeChild(maskElement)
                maskElement = null
                zoomElement = null
                imageElement = null
                shadowElement = null
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

  return ZoomImage
})))
