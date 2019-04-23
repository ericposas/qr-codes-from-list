import './scss/style.scss'
import * as PIXI from 'pixi.js'
import {
  pixiSetup,
  pixiResize
} from './modules/pixiSetup'
import '../QRCodes/Captain FalconQR.png'
import axios from 'axios'

/*function importAll(r) {
  console.log(r)
  return r.keys().map(r)
}
const images = importAll(require.context('../QRCodes', false, /\.(png|jpe?g|svg)$/));
console.log(images)*/

const app = new PIXI.Application()
const stage = app.stage
const renderer = app.renderer
const loader = PIXI.loader
const resources = PIXI.loader.resources

// standard business card size in pixels at 300 dpi
const cardSize = { w:1050, h:600 }
const cardDPI = 300

// some set up code
      //.add(images)

loader.add('./GooseQR.png')
      .add('./Captain FalconQR.png')
      .on('progress', onLoaderProgress)
      .load(pixiStart)

const onLoaderProgress = (loader, resource)=>{
  console.log(`loading: ${loader.progress}%, ${resource.url}`)
}

const pixiStart = ()=>{
  console.log('started')
  pixiSetup(app)
  pixiResize(app)
  generateCards()
}

const generateCards = ()=>{
  console.log('in generateCards')
  console.log(PIXI.utils.TextureCache['./Captain FalconQR.png'])
  const img = new PIXI.Sprite( PIXI.utils.TextureCache['./Captain FalconQR.png'] )
  stage.addChild(img)
  // console.log(img)

  /*qrCodes.forEach(code => {
    const cardShape = new PIXI.Graphics()
    cardShape.beginFill(0x6495ed)
    cardShape.drawRect(0, 0, cardSize.w/2, cardSize.h/2)
    cardShape.x = app.renderer.width/2 - cardShape.width/2
    cardShape.y = app.renderer.height/2 - cardShape.height/2
    stage.addChild(cardShape)
    const image = new PIXI.Sprite( PIXI.utils.TextureCache[code] )
    image.x = app.renderer.width/2 - image.width/2
    image.y = app.renderer.height/2 - image.height/2
    stage.addChild(image)
    console.log(code);
  })*/
}
