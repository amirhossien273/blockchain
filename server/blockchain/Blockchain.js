const Block = require("../block/Block");
const generateHash = require("../hash/Hash");


class Blockchain {

    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({data}) {

       const lastBlock = this.chain[this.chain.length - 1]
       const newBlock = Block.mine({lastBlock, data});
       this.chain.push(newBlock);
    }

   static isValidChain(chain) {

       if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for(let i = 1; i<chain.length - 1; i++){

        
           const block         = chain[i];
           const actualLatHash = chain[i-1].hash;
           const {timestamp, lastHash, hash, data, difficulty, nonce} = block;

           if(lastHash !== actualLatHash) return false;

         
            if(hash !== generateHash(timestamp, lastHash, data, difficulty, nonce)) return false;
        }

        return true;
    }

    replaceChain(newChain) {

        if(newChain.length <= this.chain.length) return;

        if(!Blockchain.isValidChain(newChain)) return;

        this.chain = newChain;
    }
}

module.exports = Blockchain;