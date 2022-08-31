// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Jimp from 'jimp';
import path from 'path';
const battleFolder = path.join(process.cwd(), './images/battle/')
const fontFolder = path.join(process.cwd(), './images/fonts/')

const templates = {
    self: {},
    team: {},
    enemy: {},
    other: {}
}

function generateHPBar(user, x, y, barType) {
    let relativeHP = user.h / user.m
    let color =
        relativeHP > 0.5 ? 'Green' :
        relativeHP > 0.25 ? 'Yellow' :
        'Red'
    let hpBar = barType != 'enemy' 
        ? templates[barType].barEmpty.clone().composite(templates[barType][`bar${color}`].clone().crop(0, 0, Math.round(x * relativeHP), y), 0, 0)
        : templates.enemy.barEmpty.clone().composite(templates.enemy[`bar${color}`].clone().crop(x - Math.round(x * relativeHP), 0, Math.round(x * relativeHP), y), x - Math.round(x * relativeHP), 0)
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
            80, 20,
            {
                opacitySource: 1,
                opacityDest: 0.8
            }
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
                3, 3,
                {
                    opacitySource: 1,
                    opacityDest: 0.8
                }
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

function createEnemyHPBars(users) {
    let team = users.shift().t
    users = users.filter(u => u.t != team)
    let displays = []
    users.forEach(user => {
        let hpBar = generateHPBar(user, 177, 7, 'enemy')
        let baseBar = templates.enemy.background
            .clone()
            .composite(
                templates.enemy.barBackground
                    .clone()
                    .composite(hpBar, 3, 2),
                6, 3,
                {
                    opacitySource: 1,
                    opacityDest: 0.8
                }
            )
        
        let levelLength = Jimp.measureText(global.fonts.OXANIUM_12_WHITE, `${user.l}`)
        baseBar.print(
            global.fonts.OXANIUM_8_WHITE, 176 - levelLength, 39,
            {
                text: 'Lv.'
            }
        )
        baseBar.print(
            global.fonts.OXANIUM_12_WHITE, 188 - levelLength, 36,
            {
                text: `${user.l}`
            }
        )
        let nameLength = Jimp.measureText(global.fonts.OXANIUM_20_WHITE, `${user.n}`)
        let font = nameLength < 170 ? global.fonts.OXANIUM_20_WHITE : global.fonts.OXANIUM_14_WHITE
        baseBar.print(
            font, 189 - nameLength, 
            font == global.fonts.OXANIUM_20_WHITE ? 16 : 18,
            {
                text: `${user.n}`,
            }
        )
        displays.push(baseBar)
    })
    return displays
}

function finalRender(users) {
    let image = templates.other.background.clone()
    let playerHPBar = createPlayerHPBar([...users])
    let teamHPBars = createTeamHPBars([...users])
    let enemyHPBars = createEnemyHPBars([...users])

    image.composite(playerHPBar, 158, 310)
    teamHPBars.forEach((bar, index) => {
        image = image.composite(bar, 2, 2 + index * 52)
    })
    enemyHPBars.forEach((bar, index) => {
        image.composite(bar, 447, 2 + index * 52)
    })

    return image
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

        templates.enemy.background = await Jimp.read(battleFolder + 'hpbar_enemy_background.png');
        templates.enemy.barBackground = await Jimp.read(battleFolder + 'hpbar_enemy_hpbar_background.png');
        templates.enemy.barGreen = await Jimp.read(battleFolder + 'hpbar_enemy_hpbar_green.png');
        templates.enemy.barRed = await Jimp.read(battleFolder + 'hpbar_enemy_hpbar_red.png');
        templates.enemy.barYellow = await Jimp.read(battleFolder + 'hpbar_enemy_hpbar_yellow.png');
        templates.enemy.barEmpty = await Jimp.read(battleFolder + 'hpbar_enemy_hpbar_empty.png');

        templates.other.background = await Jimp.read(battleFolder + 'background.png');
    }

    if(!global.fonts) global.fonts = {}
    if(!global.fonts.OXANIUM_8_WHITE) global.fonts.OXANIUM_8_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_8_white.fnt`)
    if(!global.fonts.OXANIUM_12_WHITE) global.fonts.OXANIUM_12_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_12_white.fnt`)
    if(!global.fonts.OXANIUM_14_WHITE) global.fonts.OXANIUM_14_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_14_white.fnt`)
    if(!global.fonts.OXANIUM_20_WHITE) global.fonts.OXANIUM_20_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_20_white.fnt`)
    if(!global.fonts.OXANIUM_24_WHITE) global.fonts.OXANIUM_24_WHITE = await Jimp.loadFont(`${fontFolder}OxaniumLight_24_white.fnt`)

    const { query } = req;
    const users = JSON.parse(query.users)
    let image = finalRender(users)
    res.setHeader('Content-Type', 'image/png')
    res.send(await image.getBufferAsync(Jimp.MIME_PNG)) 
}