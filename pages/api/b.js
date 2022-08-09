// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Jimp from 'jimp';
const battleFolder = `${process.cwd()}/images/battle/`
const fontFolder = `${process.cwd()}/images/fonts/`

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

function generateHPBar(user, x, y, barType) {
    let relativeHP = user.h / user.m
    let color =
        relativeHP > 0.5 ? 'Green' :
        relativeHP > 0.25 ? 'Yellow' :
        'Red'
    let hpBar = templates[barType].barEmpty.clone().composite(templates[barType][`bar${color}`].clone().crop(0, 0, Math.round(x * relativeHP), y), 0, 0)
    hpBar.setPixelColor(hpBar.getPixelColor(0, 1), 0, 0)
    return hpBar
}

function createPlayerHPBar(users) {
    let user = users[0]
    let hpBar = generateHPBar(user, 156, 7, 'self')
    let baseBar = templates.self.background
        .clone()
        .composite(
            templates.self.barBackground
                .clone()
                .composite(hpBar, 2, 2),
            80, 20
        )
    baseBar.print(
        global.fonts.OXANIUM_14_WHITE, 80, 33,
        {
            text: `${user.h} / ${user.m} HP`,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_TOP,
        },
        160
    )
    baseBar.print(
        global.fonts.OXANIUM_12_WHITE, 11, 35,
        {
            text: 'Lv.'
        }
    )
    let levelPosition = 70 - Jimp.measureText(global.fonts.OXANIUM_24_WHITE, `${user.l}`)
    baseBar.print(
        global.fonts.OXANIUM_24_WHITE, levelPosition, 15,
        {
            text: `${user.l}`,
        }
    )
    return baseBar
}

function createTeamHPBars(users) {
    let team = users.shift().t
    users = users.filter(u => u.t == team)
    let displays = []
    users.forEach(user => {
        let hpBar = generateHPBar(user, 177, 7, 'team')
        let baseBar = templates.team.background
            .clone()
            .composite(
                templates.team.barBackground
                    .clone()
                    .composite(hpBar, 2, 2),
                3, 3
            )
        baseBar.print(
            global.fonts.OXANIUM_8_WHITE, 4, 39,
            {
                text: 'Lv.'
            }
        )
        baseBar.print(
            global.fonts.OXANIUM_12_WHITE, 16, 36,
            {
                text: `${user.l}`
            }
        )
        baseBar.print(
            global.fonts.OXANIUM_8_WHITE, 155, 39,
            {
                text: 'HP',
            }
        )
        let hpTextLength = 137 - Jimp.measureText(global.fonts.OXANIUM_12_WHITE, `${user.h} / ${user.m}`)
        baseBar.print(
            global.fonts.OXANIUM_12_WHITE, hpTextLength + 15, 36,
            {
                text: `${user.h} / ${user.m}`,
            }
        )
        let font = Jimp.measureText(global.fonts.OXANIUM_20_WHITE, `${user.n}`) < 170 ? global.fonts.OXANIUM_20_WHITE : global.fonts.OXANIUM_14_WHITE
        baseBar.print(
            font, 3, 
            font == global.fonts.OXANIUM_20_WHITE ? 16 : 18,
            {
                text: `${user.n}`,
            }
        )
        displays.push(baseBar)
    })
    return displays
}


export default async function handler(req, res) {
    if (!Object.values(templates.self).length) {
        templates.self.background = await Jimp.read(battleFolder + 'hpbar_self_background.png');
        templates.self.barBackground = await Jimp.read(battleFolder + 'hpbar_self_hpbar_background.png');
        templates.self.barGreen = await Jimp.read(battleFolder + 'hpbar_self_hpbar_green.png');
        templates.self.barRed = await Jimp.read(battleFolder + 'hpbar_self_hpbar_red.png');
        templates.self.barYellow = await Jimp.read(battleFolder + 'hpbar_self_hpbar_yellow.png');
        templates.self.barEmpty = await Jimp.read(battleFolder + 'hpbar_self_hpbar_empty.png');

        templates.team.background = await Jimp.read(battleFolder + 'hpbar_team_background.png');
        templates.team.barBackground = await Jimp.read(battleFolder + 'hpbar_team_hpbar_background.png');
        templates.team.barGreen = await Jimp.read(battleFolder + 'hpbar_team_hpbar_green.png');
        templates.team.barRed = await Jimp.read(battleFolder + 'hpbar_team_hpbar_red.png');
        templates.team.barYellow = await Jimp.read(battleFolder + 'hpbar_team_hpbar_yellow.png');
        templates.team.barEmpty = await Jimp.read(battleFolder + 'hpbar_team_hpbar_empty.png');
    }

    if(!global.fonts) {
        global.fonts = {}
        global.fonts.OXANIUM_8_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_8_white.fnt`)
        global.fonts.OXANIUM_12_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_12_white.fnt`)
        global.fonts.OXANIUM_14_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_14_white.fnt`)
        global.fonts.OXANIUM_20_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_20_white.fnt`)
        global.fonts.OXANIUM_24_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_24_white.fnt`)
    }

    const { query } = req;
    const users = JSON.parse(query.users)
    let image = createTeamHPBars(users)[0]
    res.setHeader('Content-Type', 'image/png')
    res.send(await image.getBufferAsync(Jimp.MIME_PNG)) 
}