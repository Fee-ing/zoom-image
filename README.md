## 简介

原生JS，点击查看大图

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
  className: 'zoom-image',  //被选中元素须绑定的自定义类，默认为zoom-image
  minWidth: 100,    //大图的最小宽度，默认为100
  duration: 0.3   //放大动画过渡时间，单位秒，默认为0.3
})

zoomImage.on('error', data => {
  console.log(data.message)
})
```
