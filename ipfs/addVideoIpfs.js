const ipfsClient = require('ipfs-http-client');
const fs = require('fs');

const ipfs = new ipfsClient({host: 'localhost', port: '5001', protocol: 'http'})

class Ipfs {
    async addFile(filename, filePath) {
       console.log( filename, filePath)
        const file = fs.readFileSync(filePath)
     
        try{
            const fileAdded = await ipfs.add({path: filename, content: file})
            const fileHash = fileAdded[0].hash
            console.log('file added: ',fileAdded)
            return fileHash
        } catch(e) {
            return 'The IPFS error: ' + e
        }
        
        
    }
}
module.exports = new Ipfs()