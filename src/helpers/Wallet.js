import HDMW from 'oip-hdmw';
const Wallet = HDMW.Wallet;
import 'js-oip';
import { buildOipDetails, recordProtoBuilder } from 'oip-protobufjs';
//node : 10.15.1
//npm : 6.13.4

class NewWallet {
  constructor(mnemonic, userName) {
    this.myWallet = new Wallet('', {
      supported_coins: ['flo'],
      discover: false
    });
    this.mnemonic = mnemonic;
    this.userName = userName;
    this.createMnemonic = this.createMnemonic.bind(this);
    this.createRegistration = this.createRegistration.bind(this);
  }

  //oip-protobufjs
  async publishRecord(data) {
    console.log('data ', data, 'mnemonic', this.mnemonic);
    const { descriptor, name, payload, myMainAddress } = data;

    const details = buildOipDetails({ descriptor, name, payload });
    const wif = myMainAddress.getPrivateAddress();
    const { signedMessage64 } = await recordProtoBuilder({
      details,
      wif,
      network: 'mainnet'
    });

    console.log('signedMessage64 ', signedMessage64);
    //send back buit don't save
    return signedMessage64;
  }

  getCoin() {
    // let secondWallet = new Wallet(this.mnemonic)
    let bitcoin = secondWallet.getCoin('bitcoin');
  }

  async createRegistration(myWallet, userName) {
    let flo = this.myWallet.getCoin('flo');
    console.log(flo);
    let account = flo.getAccount(1);
    let myMainAddress = flo.getMainAddress();

    // let publicAddress = myMainAddress.getPublicAddress()

    //FloPub
    let publicKey = account.getExtendedPublicKey();

    //https://api.oip.io/oip/o5/record/get/latest  - record
    //https://api.oip.io/oip/o5/template/get/latest?limit=100  -descriptor

    const registration = {
      myMainAddress,
      descriptor:
        'Ck4KB3AucHJvdG8SEm9pcFByb3RvLnRlbXBsYXRlcyInCgFQEgwKBG5hbWUYASABKAkSFAoMZmxvQmlwNDRYUHViGAIgASgJYgZwcm90bzM=',
      name: 'tmpl_433C2783',
      payload: {
        name: userName,
        floBip44XPub: publicKey
      }
    };

    return registration;
  }

  async createMnemonic() {
    let mnemonic = await this.myWallet.getMnemonic();

    console.log('My Mnemonic: ' + mnemonic);
    return mnemonic;
  }
}

export default new NewWallet();
