const Rpc = require('bitcoin-rpc-async');
import wallet from './Wallet';

const sendFlo = async ( floData ) => {
    const rpcUser = 'user';
    const rpcPass = 'pass';
    const rpcHost = 'localhost';
    const rpcPort = '7313' // 7313 for main net - 17313 for test net
    const rpc = new Rpc(`http://${rpcUser}:${rpcPass}@${rpcHost}:${rpcPort}`)

    const streambedWalletAddress = 'FGbRhT3vTSTiBEe927nispTkNCYAfoYcrm'
 
    let paramObj = {'address': streambedWalletAddress, 'amount': 0.01, 'floData': floData}
    let reply = await rpc.run('sendtoaddress', paramObj)

    if (reply.error !== null) {
        return `Uh oh... error: ${reply}`
    }
    console.log(`txid: ${reply.result}`)
    console.log(
        `http://network.flo.cash/tx/${reply.result} \n`+
        `https://livenet.flocha.in/tx/${reply.result}\n`+
        `https://testnet.flocha.in/tx/${reply.result}\n`+
        `https://api.oip.io/oip/o5/record/get/${reply.result}`
    )
    return reply.result
}
const sendMulti = async ( mpx ) => {
    let myMainAddress = wallet.myMainAddress;

    mpx[0].setAddress(myMainAddress.getPublicAddress())
    let sig = myMainAddress.signMessage(mpx[0].getData())
    mpx[0].setSignature(sig)

    let floData1 = mpx[0].toString()
    let referenceTxid = await sendFloData(floData1)
    console.log("sent reference", referenceTxid)

    if (referenceTxid === '') {
        return console.log(':(');
    }

    let floDataX = [];

    for (let i = 1; i < mpx.length; i++) {
        mpx[i].setReference(referenceTxid)
        mpx[i].setAddress(myMainAddress.getPublicAddress())
        let sig = myMainAddress.signMessage(mpx[i].getData())
        mpx[i].setSignature(sig)
        floDataX.push(mpx[i].toString())
    }

        let txid = await sendFloData( floDataX )
    

    console.log("sent part", i, txid)
    console.log(`https://api.oip.io/oip/o5/record/get/${referenceTxid}`)
}
export default sendMulti




