import HDMW from 'oip-hdmw';
const Wallet = HDMW.Wallet;
import { buildOipDetails, recordProtoBuilder } from 'oip-protobufjs';
//node : 10.15.1
//npm : 6.13.4

class NewWallet {
    constructor(){
        this.myWallet = new Wallet('', {supported_coins : ['flo'], discover: false});
        this.createMnemonic = this.createMnemonic.bind(this)
        this.createRegistration = this.createRegistration.bind(this)
        this.saveAddress = this.saveAddress

    }
  
    //oip-protobufjs
    async publishRecord ( data ) {
        if (Array.isArray(data)) console.log('loog')
        console.log('data ', data, 'mnemonic', this.mnemonic)
        const { descriptor, name, payload, myMainAddress } = data
  
        const details = buildOipDetails({descriptor, name, payload })
        const wif = myMainAddress.getPrivateAddress()
        const { signedMessage64 } = await recordProtoBuilder({ details, wif, network: 'mainnet' })

        const signP64 = 'p64:'+signedMessage64;
        console.log('signedMessage64 ',signP64)
        return signP64
    }

    async createRegistration ( registration ) {
        let flo = this.myWallet.getCoin('flo')
        let account = flo.getAccount(1)
        let myMainAddress = flo.getMainAddress()

        //Adds myMainAddress top level to be used later in CreateUserForm
        // this.myMainAddress = myMainAddress;

        //FloPub
        let publicKey = account.getExtendedPublicKey()


        //https://api.oip.io/oip/o5/record/get/latest  - record
        //https://api.oip.io/oip/o5/template/get/latest?limit=100  -descriptor
        
        if (registration.length === 1) {
            //Adds myMainAddress top level to be used later in CreateUserForm
            this.myMainAddress = myMainAddress;
            console.log(registration)
            registration[0].myMainAddress = myMainAddress
            registration[0].payload.floBip44XPub = publicKey
            return registration[0]

        } else if (registration.length === 3) {
            let store = sessionStorage.getItem('userAddress');
            let userMainAddress = JSON.parse(addy)
            console.log( userMainAddress )
            console.log(registration)
          

            registration.forEach((obj, i) => {
                console.log(obj)
                console.log(obj.descriptor)
                obj.myMainAddress = userMainAddress
                obj.payload.floBip44XPub = publicKey
            })
            return registration
        }

        // const registration = {
        //     myMainAddress,
        //     descriptor: 'Ck4KB3AucHJvdG8SEm9pcFByb3RvLnRlbXBsYXRlcyInCgFQEgwKBG5hbWUYASABKAkSFAoMZmxvQmlwNDRYUHViGAIgASgJYgZwcm90bzM=',
        //     name: 'tmpl_433C2783',
        //     payload: {
        //         name: userName,
        //         floBip44XPub: publicKey
        //     }
        // }

        // return registration
    }

    async createMnemonic() {
        let mnemonic = await this.myWallet.getMnemonic()
        console.log("My Mnemonic: " + mnemonic);
        return mnemonic;
    }
}


export default new NewWallet();