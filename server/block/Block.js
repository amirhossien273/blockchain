const { GENESIS_DATA, MINE_RATE } = require("../config/config");
const generateHash = require("../hash/Hash");

class Block {
    constructor({timestamp, lastHash, hash, data, difficulty, nonce}) {
        this.timestamp        = timestamp;
        this.lastHash         = lastHash;
        this.hash             = hash;
        this.data             = data;
        this.difficulty      = difficulty;
        this.nonce            = nonce;
    }

    static genesis() {
        return new this(GENESIS_DATA)
    }

    static mine({lastBlock, data}) {
       
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        const difficulty = lastBlock.difficulty;
        let nonce = 0;
 
        do{
            nonce ++;
            timestamp = Date.now(),
            hash = generateHash(timestamp, lastHash, data, difficulty, nonce);
           
        }while(hash.substring(0,difficulty) !== '0'.repeat(difficulty))

        return new this({
            timestamp:     timestamp,
            lastHash:      lastBlock.hash,
            hash:          hash,
            data:          data,
            difficulty:   lastBlock.difficulty,
            nonce:         nonce,
        });
    }

    static adjustDifficulty({originalBlock, timestamp}) {
        const {difficulty} = originalBlock;

        if(difficulty < 1) return 1;
        if((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1;

        return difficulty + 1;
    }
}


module.exports = Block;