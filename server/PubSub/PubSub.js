const redis = require('redis');

const CHANNELS ={
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTIONPOOL: 'TRANSACTIONPOOL'
}

class PubSub{
  constructor({blockchain, transactionPool}){
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.publisher =  redis.createClient();
    this.subscriber =  redis.createClient();

    this.subscribeToChannels();

    this.subscriber.on("message", (channel, message)=>{
      this.handleMessage(channel,message)
    });
  }

  subscribeToChannels(){
    Object.values(CHANNELS).forEach(channel =>{
      this.subscriber.subscribe(channel);
    })
  }

  publish({channel, message}){
    this.subscriber.unsubscribe(channel,()=>{
      this.publisher.publish(channel, message, ()=>{
        this.subscriber.subscribe(channel);
      });

    })
  }

  broadcastChain(){
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    });
  }

  broadcastTransactionPool(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTIONPOOL,
      message: JSON.stringify(transaction)
    });
  }

  handleMessage(channel,message){
    const parsedMessage = JSON.parse(message);
    
    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage);
        break;
      case CHANNELS.TRANSACTIONPOOL:
        this.transactionPool.setTransaction(parsedMessage);
        break;
      default:
        break;
    }
  }
}

module.exports = PubSub;