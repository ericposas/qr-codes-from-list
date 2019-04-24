// QR Code API - http://goqr.me/api/
const Nightmare = require('Nightmare')
const nightmare = Nightmare({show:true})
const request = require('request')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const _ = require('underscore')
const uuid = require('uuid')
const json = {items:[]}

downloadQRs()

async function downloadQRs(){
  try{
    const list = []
    for(let i = 0; i < 1000; i++){
      list.push(uuid())
    }
    for(const item of list){
      const file = await getQR(item)
      json.items.push(file)
    }
    const outputJSON = fs.createWriteStream('qrCodes.json', { flags: 'a' })
    outputJSON.write(JSON.stringify(json), (err)=>{
      console.log('Done!')
      process.exit(1)
    })
  }catch(err){
    console.error(err)
  }
}

function getQR(item){
  return new Promise((resolve, reject)=>{
    nightmare
      .goto(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item}`)
      .then(()=>{
        const filename = `${item}QR.png`
        download(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item}`, `./QRCodes/${item}QR.png`, ()=>{
          resolve(filename)
        })
      })
      .catch(err=>{
        reject(err)
      })
    })
}

function download(uri, filename, callback) {
  request.head(uri, function () {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}
