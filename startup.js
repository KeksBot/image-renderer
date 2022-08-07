const Jimp = require('jimp');
const battleFolder = `${process.cwd()}/images/battle/`

global.templates = {
    self: {
        background: Jimp.read(battleFolder + 'hpbar_self_background.png'),
        barBackground: Jimp.read(battleFolder + 'hpbar_self_hpbar_background.png'),
        barGreen: Jimp.read(battleFolder + 'hpbar_self_hpbar_green.png'),
        barRed: Jimp.read(battleFolder + 'hpbar_self_hpbar_red.png'),
        barYellow: Jimp.read(battleFolder + 'hpbar_self_hpbar_yellow.png'),
        barEmpty: Jimp.read(battleFolder + 'hpbar_self_hpbar_empty.png'),
    }
}