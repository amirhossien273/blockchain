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
           const lastDifficulty = chain[i-1].difficulty;
           const {timestamp, lastHash, hash, data, difficulty, nonce} = block;

           if(lastHash !== actualLatHash) return false;

           
           if(Math.abs(lastDifficulty - difficulty)> 1) return false;
         
           if(hash !== generateHash(timestamp, lastHash, data, difficulty, nonce)) return false;
        }

        return true;
    }

    replaceChain(newChain, onSuccess) {

        if(newChain.length <= this.chain.length){
            // console.log('the incoming chain must be longer');
            return;
        }

        if(!Blockchain.isValidChain(newChain)){
            // console.log('the incoming chain must be valid');
            return;
        }

        if(onSuccess) onSuccess();

        // console.log('replacing chain with: ', newChain);
        this.chain = newChain;
    }
}

module.exports = Blockchain;