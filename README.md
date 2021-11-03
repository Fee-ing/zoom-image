## 简介

原生JS，点击查看大图

## Installation
```bash
npm i fee-zoom-image
```
or
```bash
yarn add fee-zoom-image
```
## Basic Usage

```js
import ZoomImage from 'fee-zoom-image'

var zoomImage = new ZoomImage({
  className: 'zoom-image'
})

zoomImage.on('error', data => {
  console.log(data.message)
})
```