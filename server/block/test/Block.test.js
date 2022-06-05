const { GENESIS_DATA, MINE_RATE } = require("../../config/config");
const hexToBinary = require("hex-to-binary");
const Block = require("../Block");

describe("Block", ()=>{
    const timestamp        = 2000;
    const lastHash         = "lastHash";
    const hash             = "hash";
    const data             = "data";
    const difficulty       = 1;
    const nonce            = 1;

    const block = new Block({timestamp, lastHash, hash, data, difficulty, nonce});

    it("test block is pass", ()=>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.difficulty).toEqual(difficulty);
        expect(block.nonce).toEqual(nonce);
    });

    describe('genesis()', ()=>{

         const genesisBlock = Block.genesis();

         it("return a block instance", ()=>{
              expect(genesisBlock instanceof Block).toEqual(true); 
         });

         it("returns the genesis data", ()=>{
            expect(genesisBlock).toEqual(GENESIS_DATA); 
       });
    });

    describe("mine()", ()=>{
       const lastBlock = Block.genesis();
       const data = "mined Block";
       const mine = Block.mine({lastBlock, data});

       it("return a block instance", ()=>{
            expect(mine instanceof Block).toEqual(true); 
        });

        it("set the `lasthash` to the `hash` of the last block", ()=>{
            expect(mine.lastHash).toEqual(lastBlock.hash); 
        });

        it("sets the data", ()=>{
            expect(mine.data).toEqual(data); 
        });

        it("sets the timestamp", ()=>{
            expect(mine.timestamp).not.toEqual(undefined); 
        });

        it("sets a hash that maces the difficulty criteria", ()=>{
            expect(hexToBinary(mine.hash).substring(0,mine.difficulty)).toEqual('0'.repeat(mine.difficulty));
        })
    });

    describe("adjustDifficulty()", ()=>{

        it('raises the difficulty for a quickly mined block',()=>{
            expect(Block.adjustDifficulty({
              originalBlock: block,
              timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty + 1);
        });

        it('lowers the difficulty for a slowly mined block',()=>{
            expect(Block.adjustDifficulty({
              originalBlock: block,
              timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(block.difficulty - 1);
        });

        it('has a lowwer limit of 1', ()=>{
            block.difficulty = -1;
            expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1);
        })

    });
});