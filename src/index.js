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
  /*const img = new PIXI.Sprite( PIXI.utils.TextureCache[ images[0] ] )
  stage.addChild(img)*/
  images.forEach(path => {
    let img = new PIXI.Sprite( PIXI.utils.TextureCache[ path ] )
    stage.addChild(img)
  })
}
