var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require( 'body-parser' );
var app = express();
var port = 3000;

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use( bodyParser.urlencoded( {
  extended: true
} ) );


app.post("/getsvg",function (req,res) {
  var Jimp = require('jimp');
  var Geo = require('geometrizejs');
  (async () => {
    var startTime = new Date()
    // load png/jpeg/gif,bmp/tiff image from url, file path or Buffer using jimp:
    var imageBuffer = Buffer.from(req.body.data.split(',')[1], 'base64');
    const image = await Jimp.read(imageBuffer)
    const bitmap = Geo.Bitmap.createFromByteArray(image.bitmap.width,
        image.bitmap.height, image.bitmap.data)
    const runner = new Geo.ImageRunner(bitmap)
    const options = {
      shapeTypes: [Geo.ShapeTypes.RECTANGLE],
      candidateShapesPerStep: 50,
      shapeMutationsPerStep: 100,
      alpha: 128
    }
    const iterations = 200
    const svgData = []
    for (var i = 0; i < iterations; i++) {
      //console.log(Geo.SvgExporter.exportShapes(runner.step(options)))
      svgData.push(Geo.SvgExporter.exportShapes(runner.step(options)))
    }
    const svg = Geo.SvgExporter.getSvgPrelude() +
        Geo.SvgExporter.getSvgNodeOpen(bitmap.width, bitmap.height) +
        svgData.join('\n') +
        Geo.SvgExporter.getSvgNodeClose()

    // in node.js:
    var result = {}

    result.data = svg
    var endTime = new Date()
    console.log((endTime-startTime)/1000 + " seconds")
    res.json(result)
  })()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;
