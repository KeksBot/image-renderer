import path from 'path';
import fs from 'fs';

export function getStaticProps() {
    // global.fonts.OXANIUM_8_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_8_white.fnt`)
    // global.fonts.OXANIUM_12_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_12_white.fnt`)
    // global.fonts.OXANIUM_14_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_14_white.fnt`)
    // global.fonts.OXANIUM_20_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_20_white.fnt`)
    // global.fonts.OXANIUM_24_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_24_white.fnt`)

    path.resolve(process.cwd(), 'fonts');
    path.resolve(process.cwd(), 'images/battle');
    console.log(fs.readdirSync(path.resolve(process.cwd(), 'fonts')));
    console.log('test')
    return {
        props: {
            a: 0
        }
    }
}

export default function Home() {
    return (
        <h1>hewwo</h1>
    )
}