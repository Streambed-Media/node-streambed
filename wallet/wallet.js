const HDMW = require('oip-hdmw');
const Wallet = HDMW.Wallet;

class newWallet {
    getMnemonic(){
        
        let myWallet = new Wallet('', {supported_coins : ['flo'], discover: false});

        console.log("My Mnemonic: '" + myWallet.getMnemonic() + "'");
    }
}


export default newWallet
