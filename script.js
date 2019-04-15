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


/*let param1
if(!process.argv[2]){
  console.log('Please provide a QR string name parameter')
  process.exit(0)
}else{
  param1 = process.argv[2]
}*/

downloadQRs()

async function downloadQRs(){
  try{
    const list = await getList()
    getQRs(list)
  }catch(err){
    console.error(err)
  }
}

async function getQRs(list){
  list.reduce((accumulator, item)=>{
    return accumulator.then(results=>{
      return nightmare
        .goto(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item}`)
        .then(()=>{
          download(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item}`, `${item}-QR.png`, ()=>{
            console.log(`${item} downloaded`)
          })
        })
        .catch(err=>{
          console.log(err)
        })
    })
  }, Promise.resolve([])).then(results=>{
    console.dir(results)
  })
}

/*function downloadItem(item){
  nightmare
    .goto(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item}`)
    .then(()=>{
      download(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item}`, `${item}-QR.png`, ()=>{
        console.log('done')
      })
    })
    .catch(err=>{
      console.log(err)
    })
}*/

function download(uri, filename, callback) {
  request.head(uri, function () {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}
