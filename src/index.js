import './scss/style.scss'
import * as PIXI from 'pixi.js'
import {
  pixiSetup,
  pixiResize
} from './modules/pixiSetup'
// import '../QRCodes/Captain FalconQR.png'
// import '../mario.jpg'
import axios from 'axios'

const importAll = r=>{
  return r.keys().map(r)
}

const app = new PIXI.Application()
const stage = app.stage
const renderer = app.renderer
const loader = PIXI.loader
const resources = PIXI.loader.resources

// standard business card size in pixels at 300 dpi
const cardSize = { w:1050, h:600 }
const cardDPI = 300

pixiSetup(app)
pixiResize(app)
;(async () => {
  try {
    const images = await importAll(require.context('../QRCodes', false, /\.(png|jpe?g|svg)$/));
    loader.add(images)
          .on('progress', onProgHandler)
          .load(()=>{ start(images) })
  }catch(err){
    console.log(err)
  }
})()

function onProgHandler(loader, resource){
  console.log(`loading ${resource.url}`)
}

function start(images){
  console.log('started')
  let downloadData = []
  images.forEach(path => {
    const container = new PIXI.Container()
    const card = new PIXI.Graphics()
    card.beginFill(0x0000ff)
    card.drawRect(0, 0, cardSize.w/2, cardSize.h/2)
    card.x = renderer.width/2 - card.width/2
    card.y = renderer.height/2 - card.height/2
    let handle = path.replace(/.\/images\//, '')
    handle = handle.replace(/QR.png/, '')
    const img = new PIXI.Sprite( PIXI.utils.TextureCache[ path ] )
    img.x = card.x + card.width - img.width - img.width/8
    img.y = card.y + card.height/2 - img.height/8
    const text = new PIXI.Text(handle, {
      fontSize: 24,
      fill: 0xffffff,
      fontFamily: 'Ubuntu'
    })
    text.x = card.x + img.width/8
    text.y = card.y + img.height/8
    container.addChild(card, img, text)
    stage.addChild(container)
    downloadSpriteToPNG(renderer, container, `${handle}.png`)
  })
}

function downloadSpriteToPNG(renderer, sprite, fileName) {
  renderer.extract.canvas(sprite).toBlob( b => {
    const a = document.createElement('a');
    document.body.append(a);
    a.download = fileName;
    a.href = URL.createObjectURL(b);
    a.click();
    a.remove();
  }, 'image/png')
}
