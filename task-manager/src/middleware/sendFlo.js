require('dotenv').config();
const Rpc = require('bitcoin-rpc-async');

const sendFlo = async (floData) => {
  console.log('flodata', floData);
  const rpcUser = 'user';
  const rpcPass = 'pass';
  const rpcHost = process.env.RPCHOST;
  const rpcPort = '7313'; // 7313 for main net - 17313 for test net
  const rpc = new Rpc(`http://${rpcUser}:${rpcPass}@${rpcHost}:${rpcPort}`);

  const streambedWalletAddress = 'FGbRhT3vTSTiBEe927nispTkNCYAfoYcrm';

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
