import { createCanvas, loadImage } from "canvas";
const imageFolder = process.cwd() + '/images/battle-v2';

const backgrounds = [[], [], []]
const hpBars = {
    player: {},
    enemy: {},
    team: {}
}

async function loadHpBar(type, color) {
    hpBars[type][color] = await loadImage(imageFolder + `/hp_bars/${type}_${color}.png`)
}

export default async function handler(req, res) {
    // parse users
    const users = JSON.parse(req.query.users)
    let enemies = users.filter(u => u.t != users[0].t)
    let teammates = users.filter(u => u.t == users[0].t).slice(1)
    let user = users[0]

    if(!hpBars.player.green) await Promise.all([
        await loadHpBar('player', 'green'),
        await loadHpBar('player', 'red'),
        await loadHpBar('player', 'yellow'),
        await loadHpBar('enemy', 'green'),
        await loadHpBar('enemy', 'red'),
        await loadHpBar('enemy', 'yellow'),
        await loadHpBar('team', 'green'),
        await loadHpBar('team', 'red'),
        await loadHpBar('team', 'yellow')
    ])

    // get correct background image
    if(!backgrounds[teammates.length][enemies.length])
        backgrounds[teammates.length][enemies.length] = await loadImage(imageFolder + `/auto/battle_background_${teammates.length}_${enemies.length}.png`)

    const background = backgrounds[teammates.length][enemies.length]

    // create canvas
    const canvas = createCanvas(1280, 720)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(background, 0, 0)

    ctx.antialias = 'none'

    ctx.textBaseline = 'top'
    ctx.textDrawingMode = 'glyph'
    ctx.textAlign = 'right';

    // draw player display

    ctx.font = '55px Oxanium, sans-serif'
    ctx.fillStyle = 'white'
    ctx.fillText(user.l, 465, 645)
    ctx.textAlign = 'center'
    ctx.font = '28px Oxanium, sans-serif'
    ctx.fillText(user.h + ' / ' + user.m + ' HP', 640, 687)
    ctx.beginPath()
    ctx.rect(484, 663, 312 * (user.h / user.m), 14)
    ctx.save()
    ctx.clip()
    ctx.drawImage(hpBars.player[user.h / user.m > .5 ? 'green' : user.h / user.m > .25 ? 'yellow' : 'red'], 172 + 312 * user.h / user.m, 663)
    ctx.closePath()
    ctx.restore()

    // draw enemy displays
    
    for(let i = 0; i < enemies.length; i++) {
        ctx.save()
        let enemy = enemies[i]
        ctx.font = '40px Oxanium, sans-serif'
        if(enemy.n.length > 15) ctx.font = '30px Oxanium, sans-serif'
        ctx.textAlign = 'right'
        ctx.fillText(enemy.n, 1270, enemy.n.length <= 15 ? 35 + (i * 104) : 43 + (i * 104), 340)
        ctx.font = '24px Oxanium, sans-serif'
        ctx.fillText(enemy.l, 1270, 80 + (i * 104))
        const width = ctx.measureText(String(enemy.l)).width
        ctx.font = '16px Oxanium, sans-serif'
        ctx.fillText('Lv.  ', 1270 - width, 86 + (i * 104))
        ctx.beginPath()
        ctx.rect(1267 - 354 * (enemy.h / enemy.m), 14 + (i * 104), 354 * (enemy.h / enemy.m), 14)
        ctx.clip()
        ctx.drawImage(hpBars.enemy[enemy.h / enemy.m > .5 ? 'green' : enemy.h / enemy.m > .25 ? 'yellow' : 'red'], 1267 - 354 * (enemy.h / enemy.m), 14 + i * 104)
        ctx.closePath()
        ctx.restore()
    }

    // draw team displays

    for(let i = 0; i < teammates.length; i++) {
        ctx.save()
        let teammate = teammates[i]
        ctx.font = '40px Oxanium, sans-serif'
        if(teammate.n.length > 15) ctx.font = '30px Oxanium, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(teammate.n, 10, teammate.n.length <= 15 ? 35 + (i * 104) : 43 + (i * 104), 340)
        ctx.font = '24px Oxanium, sans-serif'
        ctx.fillText(teammate.l, 37, 80 + (i * 104))
        ctx.textAlign = 'right'
        ctx.fillText(teammate.h + ' / ' + teammate.m, 307, 80 + (i * 104))
        ctx.beginPath()
        ctx.rect(13, 14 + (i * 104), 354 * (teammate.h / teammate.m), 14)
        ctx.clip()
        ctx.drawImage(hpBars.team[teammate.h / teammate.m > .5 ? 'green' : teammate.h / teammate.m > .25 ? 'yellow' : 'red'], -341 + 354 * (teammate.h / teammate.m), 14 + i * 104)
        ctx.closePath()
        ctx.restore()
    }

    res.setHeader('Content-Type', 'image/jpg')
    res.setHeader('Content-Disposition', 'inline');
    res.send(canvas.toBuffer('image/jpeg', { quality: .95 }))
} 