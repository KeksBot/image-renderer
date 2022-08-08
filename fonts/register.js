const Jimp = require('jimp')

module.exports = async function() {
    global.fonts = {}
    global.fonts.OXANIUM_12_WHITE = await Jimp.loadFont('./OxaniumLight_12_white.fnt')
    global.fonts.OXANIUM_14_WHITE = await Jimp.loadFont('./OxaniumLight_14_white.fnt')
    console.log('success')
}