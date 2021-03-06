const Transaction = require('./../wallet/transaction');

class TransactionMiner {

    constructor({blockchain, transactionPool, wallet, pubSub}) {
        console.log("show data1: ",blockchain)
        console.log("show data2: ",transactionPool)
        console.log("show data3: ",wallet)
        console.log("show data4: ",pubSub)
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubSub = pubSub;
    }

    mineTransactions() {

        const validTransactions = this.transactionPool.validTransactions();

        validTransactions.push(Transaction.rewardTransaction({minerWallet: this.wallet}));
    
        this.blockchain.addBlock({data: validTransactions});
    
        this.pubSub.broadcastChain();
    
        this.transactionPool.clear();
    }
}

module.exports = TransactionMiner;