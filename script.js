const Nightmare = require('Nightmare')
const nightmare = Nightmare({show:true})
const request = require('request')
const fs = require('fs')
const list = fs.createReadStream('list.txt')
const _ = require('underscore')

let chunks = []
function getList(){
  return new Promise((resolve, reject)=>{
    list.on('readable', ()=>{
      chunks.push(list.read())
    })
    list.on('end', ()=>{
      let listArr = chunks.join('').replace(/\n/g, ',').toString().split(',')
      if (_.indexOf(listArr, '')){
        _listArr = listArr.filter(item=>(item !== ''))
      }
      resolve(_listArr)
    })
    list.on('error', ()=>{
      reject()
    })
  })
}

downloadQRs()

async function downloadQRs(){
  try{
    const list = await getList()
    for(const item of list){
      await getQR(item)
    }
  }catch(err){
    console.error(err)
  }
}

function getQR(item){
  return new Promise((resolve, reject)=>{
    nightmare
      .goto(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item}`)
      .then(()=>{
        download(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item}`, `./QRCodes/${item}QR.png`, ()=>{
          resolve(`${item} downloaded`)
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
