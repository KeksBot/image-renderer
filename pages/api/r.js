import { createCanvas, loadImage } from "canvas";
var background, circlePending, circleReady

const imageFolder = process.cwd() + '/images/battle-v2'

export default async function handler(req, res) {
    if(!background) background = await loadImage(imageFolder + '/auto/ready_background.png')
    if(!circlePending) circlePending = await loadImage(imageFolder + '/ready_circle_pending.png')
    if(!circleReady) circleReady = await loadImage(imageFolder + '/ready_circle_ok.png')

    const canvas = createCanvas(1280, 720)
    const ctx = canvas.getContext('2d') 

    ctx.drawImage(background, 0, 0)

    ctx.font = '28px Oxanium, sans-serif'
    ctx.textBaseline = 'top'

    const users = JSON.parse(req.query.users)
    let index = 0
    for (const user in users) {
        let ready = users[user]
        let y = 250 + (index * 38)
        ctx.drawImage(ready ? circleReady : circlePending, 350, y)
        ctx.fillText(user, 390, y)
        index++
    }
    res.setHeader('Content-Type', 'image/jpg')
    res.setHeader('Content-Disposition', 'inline;');
    res.send(canvas.toBuffer('image/jpeg', { quality: .95 }))
}