const HDMW = require('oip-hdmw');
const Wallet = HDMW.Wallet;
const protobufjs = require('oip-protobufjs');
//node : 10.15.1
//npm : 6.13.4


class NewWallet {
    constructor(mnemonic, userName){
        this.mnemonic = mnemonic
        this.userName = userName
        this.getAddress = this.getAddress.bind(this)
 
    }

    //oip-protobufjs
    async publishRecord (data ) {
        console.log('data ', data)
        const { descriptor, name, payload, myMainAddress } = data

        const details = protobufjs.buildOipDetails({descriptor, name, payload })
        const wif = myMainAddress.getPrivateAddress()
        const { signedMessage64 } = await protobufjs.recordProtoBuilder({ details, wif, network: 'mainnet' })
        
        console.log('signedMessage64 ',signedMessage64)
        return signedMessage64
    }
    
    getCoin() {
        let secondWallet = new Wallet(this.mnemonic)
        let bitcoin = secondWallet.getCoin('bitcoin')
    }
    // 'rigid gas water tip water pair bleak expose pool recycle spider guide'
    async getAddress(mnemonic, userName='brad') {
        console.log(userName, mnemonic)
        let wallet = new Wallet( mnemonic ,{
            supported_coins : ['flo'], 
            discover: false
        });

        let flo = wallet.getCoin('flo')
        let account = flo.getAccount(1)
        let myMainAddress = flo.getMainAddress()

        let publicAddress = myMainAddress.getPublicAddress()

        //FloPub
        let publicKey = account.getExtendedPublicKey()


        //https://api.oip.io/oip/o5/record/get/latest  - record
        //https://api.oip.io/oip/o5/template/get/latest?limit=100  -descriptor

        const template = {
            myMainAddress,
            descriptor: 'Ck4KB3AucHJvdG8SEm9pcFByb3RvLnRlbXBsYXRlcyInCgFQEgwKBG5hbWUYASABKAkSFAoMZmxvQmlwNDRYUHViGAIgASgJYgZwcm90bzM=',
            name: 'tmpl_433C2783',
            payload: {
                name: userName,
                floBip44XPub: publicKey
            }
        }

        return template
    }


    async createWallet() {
        let myWallet = new Wallet('', {supported_coins : ['flo'], discover: false});
        let mnemonic = await myWallet.getMnemonic()
        console.log("My Mnemonic: " + mnemonic);
        return mnemonic;
    }
}


module.exports = new NewWallet()
