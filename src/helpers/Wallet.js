import HDMW from 'oip-hdmw';
const Wallet = HDMW.Wallet;
import { buildOipDetails, recordProtoBuilder } from 'oip-protobufjs';

class NewWallet {
  constructor() {
    this.myWallet = new Wallet('', {
      supported_coins: ['flo'],
      discover: false
    });
    this.createMnemonic = this.createMnemonic.bind(this);
    this.createRegistration = this.createRegistration.bind(this);
  }

  //oip-protobufjs
  async publishRecord(data) {
    try {
      const details = buildOipDetails(data.details);
      const wif = data.myMainAddress;

      const { signedMessage64 } = await recordProtoBuilder({
        details,
        wif,
        network: 'mainnet'
      });

      console.log('signedMessage64 ', 'p64:' + signedMessage64);

      return 'p64:' + signedMessage64;
    } catch (err) {
      return 'Failed at publishRecord: ' + err;
    }
  }

  async createRegistration(registration) {
    let flo = this.myWallet.getCoin('flo');
    let account = flo.getAccount(1);
    let myMainAddress = flo.getMainAddress();
    let pubkeyTommy = myMainAddress.getPublicAddress();

    //FloPub
    let publicKey = account.getExtendedPublicKey();

    //https://api.oip.io/oip/o5/record/get/latest  - record
    //https://api.oip.io/oip/o5/template/get/latest?limit=100  -descriptor

    if (registration.length === 1) {
      //Adds myMainAddress top level to be used later in CreateUserForm
      this.myMainAddress = myMainAddress.getPrivateAddress();
      console.log(registration);

      registration[0].payload.floBip44XPub = publicKey;

      return {
        details: registration,
        myMainAddress: this.myMainAddress,
        pubkeyTommy: pubkeyTommy
      };
      
    } else if (registration.length === 3) {
      // let store = localStorage.getItem('userAddress');
      let myMainAddress = JSON.parse(localStorage.getItem('userAddress'));

      return {
        details: registration,
        myMainAddress,
        pubkeyTommy
      };
    } else return 'Failed at CreateRegistration';
  }

  async createMnemonic() {
    let mnemonic = await this.myWallet.getMnemonic();
    console.log('My Mnemonic: ' + mnemonic);
    return mnemonic;
  }
}

export default new NewWallet();
