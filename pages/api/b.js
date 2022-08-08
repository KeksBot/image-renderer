// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Jimp from 'jimp';
const battleFolder = `${process.cwd()}/images/battle/`
const fontFolder = `${process.cwd()}/fonts/`

const templates = {
    self: {},
    team: {},
    enemy: {}
}

let input = {
    users: [
        {
            n: '12345678901234567890123456789012',
            h: 420,
            m: 1234,
            l: 123,
            t: 1
        },
        {
            n: '12345678901234567890123456789012',
            h: 12345678,
            m: 12345678,
            l: 123,
            t: 1
        },
        {
            n: '12345678901234567890123456789012',
            h: 12345678,
            m: 12345678,
            l: 123,
            t: 1
        },
        {
            n: '12345678901234567890123456789012',
            h: 12345678,
            m: 12345678,
            l: 123,
            t: 1
        },
        {
            n: '12345678901234567890123456789012',
            h: 12345678,
            m: 12345678,
            l: 123,
            t: 1
        },
        {
            n: '12345678901234567890123456789012',
            h: 12345678,
            m: 12345678,
            l: 123,
            t: 1
        },
        {
            n: '12345678901234567890123456789012',
            h: 12345678,
            m: 12345678,
            l: 123,
            t: 1
        },
        {
            n: '12345678901234567890123456789012',
            h: 12345678,
            m: 12345678,
            l: 123,
            t: 1
        },
        {
            n: '12345678901234567890123456789012',
            h: 12345678,
            m: 12345678,
            l: 123,
            t: 1
        }, {
            n: '12345678901234567890123456789012',
            h: 12345678,
            m: 12345678,
            l: 123,
            t: 1
        }
    ]
}

function generateHPBar(user, x, y) {
    let relativeHP = user.h / user.m
    let color =
        relativeHP > 0.5 ? 'Green' :
        relativeHP > 0.25 ? 'Yellow' :
        'Red'
    let hpBar = templates.self.barEmpty.clone().composite(templates.self[`bar${color}`].clone().cover(Math.round(x * relativeHP), y), 0, 0)
    hpBar.setPixelColor(hpBar.getPixelColor(0, 1), 0, 0)
    return hpBar
}

function createPlayerHPBar(users) {
    let user = users[0]
    let hpBar = generateHPBar(user, 156, 8)
    let baseBar = templates.self.background
        .clone()
        .composite(
            templates.self.barBackground
                .clone()
                .composite(hpBar, 2, 2),
            80, 20
        )
    return baseBar.print(
        global.fonts.OXANIUM_14_WHITE, 80, 33,
        {
            text: `${user.h} / ${user.m} HP`,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_TOP,
        },
        160
    )
}


export default async function handler(req, res) {
    if (!Object.values(templates.self).length) {
        templates.self.background = await Jimp.read(battleFolder + 'hpbar_self_background.png');
        templates.self.barBackground = await Jimp.read(battleFolder + 'hpbar_self_hpbar_background.png');
        templates.self.barGreen = await Jimp.read(battleFolder + 'hpbar_self_hpbar_green.png');
        templates.self.barRed = await Jimp.read(battleFolder + 'hpbar_self_hpbar_red.png');
        templates.self.barYellow = await Jimp.read(battleFolder + 'hpbar_self_hpbar_yellow.png');
        templates.self.barEmpty = await Jimp.read(battleFolder + 'hpbar_self_hpbar_empty.png');
    }

    if(!global.fonts) {
        global.fonts = {}
        global.fonts.OXANIUM_12_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_12_white.fnt`)
        global.fonts.OXANIUM_14_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_14_white.fnt`)
    }

    const { query } = req;
    const users = JSON.parse(query.users)
    let image = createPlayerHPBar(users)
    res.setHeader('Content-Type', 'image/png')
    res.send(await image.getBufferAsync(Jimp.MIME_PNG))
}