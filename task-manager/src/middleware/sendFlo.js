require('dotenv').config();
const Rpc = require('bitcoin-rpc-async');

const { RPC_USER, RPC_PASS, RPC_HOST, RPC_PORT, WALLET_ADDRESS } = process.env;

const sendFlo = async (floData) => {
  console.log('flodata', floData);
  const rpcUser = RPC_USER;
  const rpcPass = RPC_PASS;
  const rpcHost = RPC_HOST;
  const rpcPort = RPC_PORT; // 7313 for main net - 17313 for test net
  const rpc = new Rpc(`http://${rpcUser}:${rpcPass}@${rpcHost}:${rpcPort}`);

  const streambedWalletAddress = WALLET_ADDRESS;

  let paramObj = {
    address: streambedWalletAddress,
    amount: 0.01,
    floData: floData
  };
  let reply = await rpc.run('sendtoaddress', paramObj);
  console.log(reply);
  if (reply.error !== null) {
    return `Uh oh... error: ${reply}`;
  }
  if (reply.error) {
    return `Uh oh... error: ${reply.error.message}`;
  }
  console.log(`txid: ${reply.result}`);
  console.log(
    `http://network.flo.cash/tx/${reply.result} \n` +
      `https://livenet.flocha.in/tx/${reply.result}\n` +
      `https://testnet.flocha.in/tx/${reply.result}\n` +
      `https://api.oip.io/oip/o5/record/get/${reply.result}`
  );
  return reply.result;
};

module.exports = { sendFlo };
