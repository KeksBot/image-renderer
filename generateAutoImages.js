const { createCanvas, loadImage } = require("canvas")
const fs = require("fs")
const StackBlur = require('stackblur-canvas');

const imageFolder = process.cwd() + '/images/battle-v2';

(async () => {

    console.log('Starting image generation')
    console.log('Loading images')
    console.time('Loading images')
    console.time('Process duration')

    const background = await loadImage(imageFolder + '/background.png')
    const teamDisplayBase = await loadImage(imageFolder + '/team_display_base.png')
    const enemyDisplayBase = await loadImage(imageFolder + '/enemy_display_base.png')
    const playerDisplayBase = await loadImage(imageFolder + '/player_display_base.png')
    const readyBox = await loadImage(imageFolder + '/ready_box.svg')

    console.timeEnd('Loading images')

    const enemyDisplayPositionX = 1280 - enemyDisplayBase.width - 4

    // Battle Background

    console.log('Generating battle backgrounds');
    console.time('Generating battle backgrounds');

    for (let enemyIndex = 1; enemyIndex <= 3; enemyIndex++) {
        for (let teamIndex = 0; teamIndex <= 2; teamIndex++) {
            const canvas = createCanvas(1280, 720)
            const ctx = canvas.getContext('2d')

            ctx.textDrawingMode = 'glyph'
            ctx.textBaseline = 'top'
            ctx.font = '16px Oxanium, sans-serif'
            ctx.fillStyle = 'white'
            ctx.drawImage(background, 0, 0)

            for (let index = 0; index < teamIndex; index++) {
                ctx.drawImage(teamDisplayBase, 4, 4 + (index * 104))
                ctx.fillText('Lv.  ', 10, 86 + (index * 104))
                ctx.fillText('HP', 315, 86 + (index * 104))
            }

            for (let index = 0; index < enemyIndex; index++) {
                ctx.drawImage(enemyDisplayBase, enemyDisplayPositionX, 4 + (index * 104))
            }

            ctx.drawImage(playerDisplayBase, (1280 - playerDisplayBase.width) / 2, 720 - playerDisplayBase.height)

            const buffer = canvas.toBuffer('image/png')
            fs.writeFileSync(imageFolder + `/auto/battle_background_${teamIndex}_${enemyIndex}.png`, buffer)
        }
    }

    console.timeEnd('Generating battle backgrounds')

    // Ready Background

    console.log('Generating ready background');
    console.time('Generating ready background');

    (() => {
        const canvas = createCanvas(1280, 720)
        const ctx = canvas.getContext('2d')

        ctx.drawImage(background, 0, 0)

        const x = 1280 / 2 - readyBox.width / 2
        const y = 720 / 2 - readyBox.height / 2

        StackBlur.canvasRGB(canvas, x + 100, y, readyBox.width - 200, readyBox.height, 8)

        ctx.drawImage(readyBox, x, y)

        const buffer = canvas.toBuffer('image/png')
        fs.writeFileSync(imageFolder + `/auto/ready_background.png`, buffer)
    })()

    console.timeEnd('Generating ready background')
    console.log('Generation complete')
    console.timeEnd('Process duration')
})()