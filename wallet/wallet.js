const HDMW = require('oip-hdmw');
const Wallet = HDMW.Wallet;


let myWallet = new Wallet('', {supported_coins : ['flo'], discover: false});

console.log("My Mnemonic: '" + myWallet.getMnemonic() + "'");

