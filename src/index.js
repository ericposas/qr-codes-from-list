import './scss/style.scss'
import * as PIXI from 'pixi.js'
import {
  pixiSetup,
  pixiResize
} from './modules/pixiSetup'
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

// some set up code
      //.add(images)
const onLoaderProgress = (loader, resource)=>{
  console.log(`loading: ${loader.progress}%, ${resource.url}`)
}

const pixiStart = qrs=>{
  console.log('started')
  pixiSetup(app)
  pixiResize(app)
  generateCards(qrs)
}

const generateCards = qrCodes=>{
  console.log('in generateCards')
  console.log(qrCodes)
  qrCodes.forEach(code => {
    code = JSON.stringify(code)
    /*const cardShape = new PIXI.Graphics()
    cardShape.beginFill(0x6495ed)
    cardShape.drawRect(0, 0, cardSize.w/2, cardSize.h/2)
    cardShape.x = app.renderer.width/2 - cardShape.width/2
    cardShape.y = app.renderer.height/2 - cardShape.height/2
    stage.addChild(cardShape)*/
    console.log(code)
    const img = new PIXI.Sprite( PIXI.utils.TextureCache[code] )
    stage.addChild(img)
  })
}

;(async ()=>{
  try {
    const images = await importAll(require.context('../QRCodes', false, /\.(png|jpe?g|svg)$/));
    console.log('images imported')
    await loader.add(images)
                .on('progress', onLoaderProgress)
                .load()
    pixiStart(images)
  }catch(err){
    console.log(err)
  }
})()
