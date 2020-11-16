var Jimp = require('jimp');
var Geo = require('geometrizejs');
var fs = require('fs');
const SvgGif = require('./SvgGif');


(async () => {
    var startTime = new Date()
    // load png/jpeg/gif,bmp/tiff image from url, file path or Buffer using jimp:
    const image = await Jimp.read('me.jpeg')
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
    for (let i = 0; i < iterations; i++) {
        //console.log(Geo.SvgExporter.exportShapes(runner.step(options)))
        svgData.push(Geo.SvgExporter.exportShapes(runner.step(options)))
    }
    const svg = Geo.SvgExporter.getSvgPrelude() +
        Geo.SvgExporter.getSvgNodeOpen(bitmap.width, bitmap.height) +
        svgData.join('\n') +
        Geo.SvgExporter.getSvgNodeClose()

    // console.log(typeof (svg))

    // const width = 294;
    // const height = 412;
    //
    // (async () => {
    //
    //     const gif = new SvgGif({
    //         width,
    //         height,
    //         fileName: 'img.gif'
    //     });
    //
    //     console.log(`Generating...`);
    //
    //     // Render 1 frame for 1 second
    //     await gif.addFrame(svg, 10);
    //
    //     // Modify SVG here and render frame
    //     await gif.addFrame(svg, 10);
    //
    //     // Done
    //     gif.finish();
    //     console.log(`Done.`);
    // })();


    // in node.js:
    console.log(svg)
    //fs.writeFileSync('output.svg', svg)
    var endTime = new Date()

    console.log((endTime-startTime)/1000 + " seconds")


    // in the browser:
    //document.getElementById('svg-container').innerHTML = svg
})()