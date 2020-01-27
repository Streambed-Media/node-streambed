import HDMW from 'oip-hdmw';
const Wallet = HDMW.Wallet;
import { buildOipDetails, recordProtoBuilder } from 'oip-protobufjs';
// import CreateUserForm  from '../components/UserForms/CreateUserForm'
// console.log(CreateUserForm)
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
        const signP64Arr = []
        // More than one block to sign ( Video blocks )
        if (Array.isArray( data )) {
            let length = data.length
    
            while ( length ) {
                length--;
                const { descriptor, name, payload, myMainAddress } = data[length]
                const details = buildOipDetails({descriptor, name, payload })
                console.log(myMainAddress)
                const wif = myMainAddress
                // const wif = myMainAddress.getPrivateAddress()  //happen in the createRegistration first?????????
                const { signedMessage64 } = await recordProtoBuilder({ details, wif, network: 'mainnet' })

                signP64Arr.push('p64:'+signedMessage64)
      
            }
        }

        console.log('data ', data, 'mnemonic', this.mnemonic)
   
        console.log('signedMessage64 ',signP64Arr)

        //Send as a string if signP64Arr is a single element, else send as signed 64 array
        const signP64 = signP64Arr.length === 1 ? signP64Arr[0] : signP64Arr
        console.log(signP64)
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
       
            this.test = myMainAddress

            //Adds myMainAddress top level to be used later in CreateUserForm
            this.myMainAddress = myMainAddress.getPrivateAddress(); // Can I do this here instead of publish Record above?
            console.log(this.myMainAddress)
    
            console.log(registration)
            
            // registration[0].myMainAddress = myMainAddress
            registration[0].myMainAddress = this.myMainAddress
            registration[0].payload.floBip44XPub = publicKey
          
            return registration[0]

        } else if (registration.length === 3) {
            // let store = localStorage.getItem('userAddress');
            let usersMainAddress = JSON.parse( localStorage.getItem('userAddress') );
 
            console.log( usersMainAddress )
          
            registration.forEach((obj, i) => {
                console.log(obj)
                obj.myMainAddress = usersMainAddress
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