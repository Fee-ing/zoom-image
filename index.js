!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["fee-zoom-image"]=t():e["fee-zoom-image"]=t()}(self,(function(){return(()=>{"use strict";var e={d:(t,o)=>{for(var n in o)e.o(o,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:o[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{default:()=>o});const o=class{constructor(e={}){this.options={className:"zoom-image",minWidth:100,duration:.3,enableWheelScale:!0,enableDragMove:!0,...e},this.imageSrc="",this.srcType="",this.originWidth=0,this.originHeight=0,this.zoomWidth=0,this.zoomHeight=0,this.offsetLeft=0,this.offsetTop=0,this.scrollLeft=0,this.scrollTop=0,this.scaleX=1,this.scaleY=1,this.translateX=0,this.translateY=0,this.wheelTimes=1,this.transitionFlag=!1,this.listeners={},this.init()}reset(){this.imageSrc="",this.srcType="",this.originWidth=0,this.originHeight=0,this.zoomWidth=0,this.zoomHeight=0,this.offsetLeft=0,this.offsetTop=0,this.scrollLeft=0,this.scrollTop=0,this.scaleX=1,this.scaleY=1,this.translateX=0,this.translateY=0,this.wheelTimes=1,this.transitionFlag=!1}on(e,t){return void 0===this.listeners[e]&&(this.listeners[e]=[]),"function"==typeof t&&this.listeners[e].push(t),this}off(e,t){let o=this.listeners[e];if("string"==typeof e&&o instanceof Array)if("function"==typeof t){for(let n=0,i=o.length;n<i;n+=1)if(o[n]===t){this.listeners[e].splice(n,1);break}}else delete this.listeners[e];return this}emit(e,t={}){let o=this.listeners[e];if(o instanceof Array)for(let n=0,i=o.length;n<i;n+=1)"function"==typeof o[n]&&o[n]({type:e,...t});return this}getElementLeft(e){return this.offsetLeft+=e.offsetLeft||0,e.offsetParent?this.getElementLeft(e.offsetParent):this.offsetLeft}getElementTop(e){return this.offsetTop+=e.offsetTop||0,e.offsetParent?this.getElementTop(e.offsetParent):this.offsetTop}getScrollLeft(e){return this.scrollLeft+=e.scrollLeft||0,e.parentNode?this.getScrollLeft(e.parentNode):this.scrollLeft}getScrollTop(e){return this.scrollTop+=e.scrollTop||0,e.parentNode?this.getScrollTop(e.parentNode):this.scrollTop}getElementCss(e,t){return"getComputedStyle"in window?window.getComputedStyle(e,null)[t]:e.currentStyle[t]}createImageElement(e,t){let o=new Image;if(o.src=e,o.complete)t&&t(o);else{o.onload=function(){t&&t(o),o.onload=null};let e=this;o.onerror=function(){e.emit("error",{message:"获取图片失败"}),o=null}}}addEvent(e,t,o){e.addEventListener?e.addEventListener(t,o,!1):e.attachEvent?e.attachEvent(`on${t}`,o):e[`on${t}`]=o}init(){const e=this;document.onclick=function(t){const o=t.target;o.className.indexOf(e.options.className)<0||(e.reset(),o.src?(e.imageSrc=o.src,e.srcType="1"):(e.imageSrc=e.getElementCss(o,"background-image"),e.imageSrc&&(e.imageSrc=e.imageSrc.replace(/(^url\(('|"){1})|(('|"){1}\)$)/g,""),e.srcType="2")),e.imageSrc?e.createImageElement(e.imageSrc,(t=>{const n=document.documentElement.clientWidth||document.body.clientWidth,i=document.documentElement.clientHeight||document.body.clientHeight;e.offsetLeft=e.getElementLeft(o),e.offsetTop=e.getElementTop(o),e.scrollLeft=e.getScrollLeft(o),e.scrollTop=e.getScrollTop(o),e.offsetLeft-=e.scrollLeft,e.offsetTop-=e.scrollTop,e.originWidth=o.offsetWidth,e.originHeight=o.offsetHeight;const s=t.width/t.height;e.zoomWidth=t.width<e.options.minWidth?e.options.minWidth:t.width,e.zoomHeight=e.zoomWidth/s,e.zoomWidth>.9*n&&(e.zoomWidth=.9*n,e.zoomHeight=e.zoomWidth/s),e.zoomHeight>.9*i&&(e.zoomHeight=.9*i,e.zoomWidth=e.zoomHeight*s),e.scaleX=e.zoomWidth/e.originWidth,e.scaleY=e.zoomHeight/e.originHeight,e.translateX=n/2-(e.offsetLeft+e.originWidth/2),e.translateY=i/2-(e.offsetTop+e.originHeight/2);let l=null,r=null;"1"===e.srcType?l=t:"2"===e.srcType&&(l=document.createElement("div"),r=document.createElement("div"),r.style.cssText+=`\n            position: absolute;\n            left: 0px;\n            top: 0px;\n            z-index: 1;\n            width: 100%;\n            height: 100%;\n            opacity: 1;\n            transition: opacity ${e.options.duration}s;\n            background-repeat: no-repeat;\n            background-image: url(${e.imageSrc});\n            background-size: ${e.getElementCss(o,"background-size")};\n            background-position: ${e.getElementCss(o,"background-position")};\n          `,t.style.cssText+=`\n            position: absolute;\n            left: 0px;\n            top: 0px;\n            z-index: 2;\n            width: 100%;\n            height: 100%;\n            opacity: 0;\n            transition: opacity ${e.options.duration}s;\n          `,l.appendChild(r),l.appendChild(t)),l.style.cssText+=`\n          position: absolute;\n          width: ${e.originWidth}px;\n          height: ${e.originHeight}px;\n          left: ${e.offsetLeft}px;\n          top: ${e.offsetTop}px;\n          transition: transform ${e.options.duration}s;\n          overflow: hidden;\n        `;let a=document.createElement("div");function c(t){let o=!1;((t=t||window.event).wheelDelta?t.wheelDelta:40*-t.detail)>0?e.wheelTimes+=e.wheelTimes<1?.2:.5:(e.wheelTimes-=e.wheelTimes<=1?.2:.5,o=!0),e.wheelTimes>5?e.wheelTimes=5:e.wheelTimes<.2?e.wheelTimes=.2:(o&&(e.translateX=n/2-(e.offsetLeft+e.originWidth/2),e.translateY=i/2-(e.offsetTop+e.originHeight/2)),l.style.cssText+=`\n            transition: transform ${e.options.duration}s;\n            cursor: ${e.wheelTimes>1?"move":"auto"};\n            transform: translate(${e.translateX}px, ${e.translateY}px) scale(${e.scaleX*e.wheelTimes}, ${e.scaleY*e.wheelTimes});\n          `)}if(a.style.cssText+=`\n          position: fixed;\n          top: 0px;\n          left: 0px;\n          z-index: 1001;\n          width: 100%;\n          height: 100%;\n          overflow: hidden;\n          transition: background-color ${e.options.duration}s;\n          transform: translate3d(0, 0, 0);\n        `,a.appendChild(l),document.body.appendChild(a),setTimeout((()=>{a.style.cssText+="background-color: rgba(0, 0, 0, 0.55);",l.style.cssText+=`\n            transform: translate(${e.translateX}px, ${e.translateY}px) scale(${e.scaleX}, ${e.scaleY});\n          `,"2"===e.srcType&&(r.style.cssText+="\n              opacity: 0;\n            ",t.style.cssText+="\n              opacity: 1;\n            ")})),e.options.enableWheelScale&&(e.addEvent(l,"mousewheel",c),e.addEvent(l,"DOMMouseScroll",c)),e.options.enableWheelScale&&e.options.enableDragMove){let t=!1,o=0,n=0,i=0,s=0;e.addEvent(l,"mousedown",(function(i){e.wheelTimes<=1||(t=!0,o=i.clientX,n=i.clientY,i.preventDefault(),i.stopPropagation())})),e.addEvent(l,"mousemove",(function(r){e.wheelTimes<=1||!t||(i=r.clientX-o,s=r.clientY-n,l.style.cssText+=`\n              transition: none;\n              transform: translate(${e.translateX+i}px, ${e.translateY+s}px) scale(${e.scaleX*e.wheelTimes}, ${e.scaleY*e.wheelTimes});\n            `,r.preventDefault(),r.stopPropagation())})),e.addEvent(l,"mouseup",(function(o){e.wheelTimes<=1||(t&&(e.translateX+=i,e.translateY+=s,i=0,s=0),t=!1,o.preventDefault(),o.stopPropagation())})),l.onclick=function(t){e.wheelTimes>1&&t.stopPropagation()}}a.onclick=function(o){o.stopPropagation(),a.style.backgroundColor="",l.style.cssText+=`\n            transition: transform ${e.options.duration}s;\n            transform: none;\n          `,"2"===e.srcType&&(r.style.cssText+="\n              opacity: 1;\n            ",t.style.cssText+="\n              opacity: 0;\n            ")},a.addEventListener("transitionend",(function(o){"background-color"===o.propertyName&&(e.transitionFlag?(document.body.removeChild(a),a=null,l=null,t=null,r=null,e.transitionFlag=!1):e.transitionFlag=!0)}),!1)})):e.emit("error",{message:"获取图片失败"}))}}};return t})()}));