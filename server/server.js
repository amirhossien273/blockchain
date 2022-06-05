const express = require('express');
const Blockchain = require('./blockchain/Blockchain');
const PubSub = require('./PubSub/PubSub');
const TransactionPool = require("./wallet/TransactionPool");
const Wallet = require("./wallet/Wallet");
const tcpPortUsed = require('tcp-port-used');
const axios = require('axios');
const res = require('express/lib/response');


const app = express();
app.use(express.json());

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubSub = new PubSub({blockchain, transactionPool});

setTimeout(()=>{
  pubSub.broadcastChain()
},1000);

app.get('/api/blocks', (req, res)=>{
  res.json(blockchain.chain);
});

app.get('/api/transaction-map-pool', (req, res)=>{
  res.json(transactionPool.transactionMap);
});

app.post('/api/transact', (req,res)=>{
  let {amount, recipient} = req.body;
  amount = parseInt(amount);
  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey
  });

  if(transaction){
     transaction.update({senderWallet: wallet, amount, recipient });
  }else{
    transaction = wallet.createTransaction({amount, recipient});
  }
  transactionPool.setTransaction(transaction);
  pubSub.broadcastTransactionPool(transaction);
  // console.log("transactionPool: ",transactionPool);
  res.json({transaction});
});

app.post('/api/mine', (req,res)=>{

  const {data} = req.body;
  blockchain.addBlock({data});
  pubSub.broadcastChain()
  res.redirect('/api/blocks');
});


const rootPort = 3000;
let PORT = 3000;



const syncOnConnect = async () => {
  let response = await axios.get(`http://localhost:${rootPort}/api/blocks`);
  blockchain.replaceChain(response.data);

  response = await axios.get(`http://localhost:${rootPort}/api/transaction-pool-map`);
  transactionPool.setMap(response.data);

};

tcpPortUsed.check(3000,'127.0.0.1')
.then(function(inUse){
  if(inUse){
    PORT += Math.ceil(Math.random() * 1000);
  }

  app.listen(PORT, ()=>{ console.log(`listening at localhost:${PORT}`);
    if(PORT !== rootPort) syncOnConnect();
  });
});
