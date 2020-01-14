const HDMW = require('oip-hdmw');
const Wallet = HDMW.Wallet;
const protobufjs = require('oip-protobufjs');
console.log(protobufjs)
const hey = require('../dummy.js');
//node : 10.15.1
//npm : 6.13.4


class NewWallet {
    constructor(mnemonic, userName){
        this.mnemonic = mnemonic
        this.userName = userName
        this.getAddress = this.getAddress.bind(this)
    }

    //oip-protobufjs
    publishRecord () {
        // const details = buildOipDetails({ descriptor, name, payload })
        // const { signedMessage64 } = recordProtoBuilder({ details, wif, network: 'mainnet' })
        // console.log(myMainAddress.getPrivateAddress())
        // console.log(signedMessage64)
        // this.publishRecord( publicKey,  myMainAddress)
    }
    
    getCoin() {
        let secondWallet = new Wallet(this.mnemonic)
        let bitcoin = secondWallet.getCoin('bitcoin')
    }

    getAddress(userName) {
        console.log(userName)
        let wallet = new Wallet('rigid gas water tip water pair bleak expose pool recycle spider guide',{
            supported_coins : ['flo'], 
            discover: false
        });

        let bitcoin = wallet.getCoin('flo')
        
        // console.log('bitcoin: ', bitcoin)
        let myMainAddress = bitcoin.getMainAddress()
        let publicAddress = myMainAddress.getPublicAddress()
        console.log('publicAddress ', publicAddress)

        //FloPub
        let publicKey = bitcoin.getExtendedPublicKey()

        const descriptor = ''
        const name = 'tmpl_433C2783'
        const payload = {
            name: 'brad',
            floBip44XPub: 'ahjfajohdfoahjd'
        }
        
        const details = protobufjs.buildOipDetails({ descriptor, name, payload })
        const wif = myMainAddress.getPrivateAddress()
        console.log('wif', wif)
        const { signedMessage64 } = protobufjs.recordProtoBuilder({ details, wif, network: 'mainnet' })
 
        console.log('signedMessage64 ',signedMessage64)
        this.publishRecord( publicKey,  myMainAddress)
    }


    createWallet() {
        let myWallet = new Wallet('', {supported_coins : ['flo'], discover: false});
        let mnemonic = myWallet.getMnemonic()
        console.log("My Mnemonic: " + mnemonic);
    }
}


module.exports = new NewWallet()
