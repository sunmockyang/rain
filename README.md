# Rain
Rain on window simulator in HTML5 canvas. Completed in a day.

Inspired by: http://maroslaw.github.io/rainyday.js/demo1.html

Online demo: http://sunmock.com/canvas/rain/rain.html

## Nuts and bolts
The particles are semi transparent shapes that change colour depending on the background image's colour at its position. This is done by using the following canvas javascript function to get the RGB value of a pixel at x/y.

```javascript
context.getImageData(x, y, 1, 1).data
```

This function is rather slow however is the only way to get RGB data of an image. So to optimize, the image is redrawn in an offscreen canvas in a much reduced size and the data is pulled from this image.

Open up console and enter in the following to see the smaller image and the location of each particle.
```javascript
debugMode = true
```

The slow dripping/falling behaviour of the rain drops was modelled using perlin noise for a more natural falling rather than using a random function. The library used is here: https://gist.github.com/banksean/304522

## Image sources
- abandoned.jpg - http://wallbase.cc/wallpaper/261189
- city.jpg - http://wallbase.cc/wallpaper/678563
- danbo.jpg - http://wallbase.cc/wallpaper/747497
- japan.jpg - http://wallbase.cc/wallpaper/788560
- japan2.jpg - http://wallbase.cc/wallpaper/2830319
- skyline.jpg - http://wallbase.cc/wallpaper/541166
