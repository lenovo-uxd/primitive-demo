var Jimp = require('jimp');
var Geo = require('geometrizejs');

(async () => {
    var startTime = new Date()
    // load png/jpeg/gif,bmp/tiff image from url, file path or Buffer using jimp:
    const image = await Jimp.read('me.jpeg')
    const bitmap = Geo.Bitmap.createFromByteArray(image.bitmap.width,
        image.bitmap.height, image.bitmap.data)
    const runner = new Geo.ImageRunner(bitmap)
    const options = {
        shapeTypes: [Geo.ShapeTypes.ROTATED_RECTANGLE],
        candidateShapesPerStep: 50,
        shapeMutationsPerStep: 100,
        alpha: 128
    }
    const iterations = 200
    for (let i = 0; i < iterations; i++) {
        const r = runner.step(options)

        const bytes = runner.getImageData().getBytes().b
        const out = new Jimp({
            width: image.bitmap.width,
            height: image.bitmap.height,
            data: bytes
        })
        // in node.js we could write it to file
        await out.writeAsync('tmp/bitmap/logo'+i+'.png')

    }
    var endTime = new Date()

    console.log((endTime-startTime)/1000 + " seconds")
    // const bytes = runner.getImageData().getBytes().b
    // const out = new Jimp({
    //     width: image.bitmap.width,
    //     height: image.bitmap.height,
    //     data: bytes
    // })
    // // in node.js we could write it to file
    // await out.writeAync('tmp/bitmap/logo'+i+'.png')

    // in the browser we could write it to a <img> element as data url
    //document.getElementById('target-image').src = await out.getBase64Async()
})()