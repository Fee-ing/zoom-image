## 简介

原生JS，点击查看大图，点开大图后，可用鼠标滚轮放大缩小图片，通过滚轮放大后，可拖拽图片。适用于PC浏览器。

## 安装
```bash
npm i fee-zoom-image
```
or
```bash
yarn add fee-zoom-image
```
## 使用

```js
import ZoomImage from 'fee-zoom-image'

var zoomImage = new ZoomImage({
  className: 'zoom-image',  //被选中元素须绑定的自定义类，字符串，默认为zoom-image
  minWidth: 100,    //大图的最小宽度，数字，最小20，最大500，默认为100
  duration: 0.3,   //放大动画过渡时间，数字，单位秒，最小0，最大1，默认为0.3
  enableWheelScale: true,    //点开大图后，是否开启鼠标滚轮放大缩小，布尔值，默认为true
  enableDragMove: true    //须先开启滚轮放大缩小，当滚轮放大图片后，是否可拖拽图片，布尔值，默认为true
})

zoomImage.on('error', data => {
  console.log(data.message)
})
```
