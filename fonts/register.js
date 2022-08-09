const Jimp = require('jimp')
import image1 from './3jhZXPpA0WfjMiDUoTJHs0zJ.ttf_0.png'
import image2 from './d23wc7c5ypY72NuGMhRPed6a.ttf_0.png'
import image3 from './gHP3L_gjp_hp3pQorAvGzGa7.ttf_0.png'
import image4 from './kXWsn3L1zGM8NvLOn19v1A6g.ttf_0.png'
import font8 from './OxaniumLight_8_white.fnt'
import font12 from './OxaniumLight_12_white.fnt'
import font14 from './OxaniumLight_14_white.fnt'
import font20 from './OxaniumLight_20_white.fnt'
import font24 from './OxaniumLight_24_white.fnt'

module.exports = async function() {
    global.fonts = {}
    global.fonts.OXANIUM_12_WHITE = await Jimp.loadFont('./OxaniumLight_12_white.fnt')
    global.fonts.OXANIUM_14_WHITE = await Jimp.loadFont('./OxaniumLight_14_white.fnt')
    console.log('success')
}