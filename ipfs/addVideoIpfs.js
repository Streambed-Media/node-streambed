const ipfsClient = require('ipfs-http-client');
const fs = require('fs');

const ipfs = new ipfsClient({host: 'localhost', port: '5001', protocol: 'http'})

class Ipfs {
    async addFile(videoInfo) {

        const video = fs.readFileSync(videoInfo.videoFilePath)
        const thumb = fs.readFileSync(videoInfo.imgFilePath)

        console.log(video, thumb)
        try{
            // const fileAdded = await ipfs.add({path: filename, content: file})
            const fileAdded = await ipfs.add({
                path: videoInfo.videoFilePath, content: video
            },
            {
                path: videoInfo.imgFilePath, content: thumb
            })

            // hash for uploads folder of files
            const fileHash = fileAdded[1].hash
            console.log('file added: ',fileAdded[1])

            return fileHash
        } catch(e) {
            return 'The IPFS error: ' + e
        }
    }
}

module.exports = new Ipfs()