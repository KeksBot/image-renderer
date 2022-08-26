import Jimp from 'jimp'
import path from 'path'

const templates = {}

function render(users) {
    let image = templates.background.clone()
    let index = 0
    for (const user in users) {
        let ready = users[user]
        let y = 125 + (index * 19)
        image.composite(ready ? templates.ready : templates.waiting, 175, y)
        image.print(global.fonts.OXANIUM_14_BLACK, 195, y, {
            text: user
        })
        index++
    }
    return image
}

export default async function Handler(req, res) {
    if(!templates.background) templates.background = await Jimp.read(path.join(process.cwd(), '/images/battle/ready_background.png'))
    if(!templates.waiting) templates.waiting = await Jimp.read(path.join(process.cwd(), '/images/battle/ready_icon_not_ready.png'))
    if(!templates.ready) templates.ready = await Jimp.read(path.join(process.cwd(), '/images/battle/ready_icon_ready.png'))

    if(!global.fonts) global.fonts = {}
    if(!global.fonts.OXANIUM_14_BLACK) global.fonts.OXANIUM_14_BLACK = await Jimp.loadFont(path.join(process.cwd(), 'images/fonts/OxaniumLight_14_black.fnt'))

    const { query } = req;
    const users = JSON.parse(query.users);
    let image = render(users)
    res.setHeader('Content-Type', 'image/png')
    res.send(await image.getBufferAsync(Jimp.MIME_PNG))
}