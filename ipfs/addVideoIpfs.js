const ipfsClient = require('ipfs-http-client');
const express = require('express');
const fs = require('fs');

const ipfs = new ipfsClient({host: 'localhost', port: '5001', protocol: 'http'})

class Ipfs {
    async addFile(filename, filePath){
        const file = fs.readFileSync(filePath)
        const fileAdded = await ipfs.add({path: filename, content: file})
        const fileHash = fileAdded[0].hash
        
        return fileHash
    }
}
module.exports = new Ipfs()