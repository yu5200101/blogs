```css
// 使下载按钮消失
audio::-webkit-media-controls {
  overflow: hidden !important
}
audio::-webkit-media-controls-enclosure {
  width: calc(100% + 40px);
  margin-left: auto;
}
audio {
  border-radius: 50px;
}
```

ios 10 小窗播放:webkit-playsinline
ios小窗播放:playsinline
android 小窗播放: x5-playsinline
预加载preload="auto"
controlsList="nodownload" 没有下载按钮
oncontextmenu="return false" 无法右键
controls="controls" 有控制条

```html
<audio
  controlsList="nodownload"
  oncontextmenu="return false"
  class="audio"
  controls="controls">
</audio>
```
```javascript
// video.play()必须在微信Weixin JSAPI的WeixinJSBridgeReady才能生效
document.addEventListener('WeixinJSBridgeReady', () => {
  document.getElementById('audio').play()
}, false)
```