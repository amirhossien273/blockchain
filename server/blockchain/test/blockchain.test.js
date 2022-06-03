const Block = require("../../block/Block");
const Blockchain = require("../Blockchain");


describe("Blockchain", ()=>{
    let blockchain = new Blockchain();

    beforeEach(()=>{
         blockchain = new Blockchain();
    })

    it("contains a `chain` array instance", ()=> {
        expect(blockchain.chain instanceof Array).toBe(true);
    });
    it("starts with the genesis block", ()=> {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });
    // it("adds new block to the chain", ()=> {
    //     const data = "new data";
    //     blockchain.addBlock({data});
    //     expect(blockchain.chain[blockchain.chain.lenght -1].data).toEqual(data);
    // });
});

describe("isValidChain", ()=>{
    let blockchain = new Blockchain();

    beforeEach(()=>{
         blockchain = new Blockchain();
    })
    describe("when the chain dose not start whit `genesis`", ()=>{
        it("return false", ()=> {
            blockchain.chain[0] = {data: 'fake-genesis'};
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
    });

    describe("when the chain dose start whit `genesis` and hase multiple blocks", ()=>{
        beforeEach(()=>{
            blockchain.addBlock({data: 'one'});
            blockchain.addBlock({data: 'two'});
            blockchain.addBlock({data: 'three'});
       });
        describe("and a lastHash refrenece has changed", ()=>{
            it("return false", ()=> {
                blockchain.chain[2].lastHash = 'fake-last-hash';
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe("and the chain contain a block whit an invalid field", ()=>{
            it("return false", ()=> {
                blockchain.chain[2].data = 'fake-data';
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe("and the chain dose not contain any invalid blocks", ()=>{
            it("return true", ()=> {
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
            });
        });
    });

});

describe("replaceChain", ()=>{
    let blockchain, newBlockchain, originalChain;

    beforeEach(()=>{
        blockchain = new Blockchain();
        newBlockchain = new Blockchain();
        originalChain = blockchain.chain;
    })

    describe("when new blockchain is not longer", ()=>{
        it('does not replace the chain', ()=>{
            newBlockchain.chain[0] = {new: 'chain'};
            blockchain.replaceChain(newBlockchain.chain);
            expect(blockchain.chain).toEqual(originalChain);
        });
    });

    describe("when new blockchain is longer", ()=>{
        beforeEach(()=>{
            newBlockchain.addBlock({data: 'one'});
            newBlockchain.addBlock({data: 'two'});
            newBlockchain.addBlock({data: 'three'});
        });
        describe("when new blockchain is invalid", ()=>{
            it('does not replace the chain', ()=>{
                newBlockchain.chain[2].lastHash = 'fake-hash';
                blockchain.replaceChain(newBlockchain.chain);
                expect(blockchain.chain).toEqual(originalChain);
            });
        });
        
        describe("when new blockchain is valid", ()=>{
            it('replace the chain', ()=>{
                blockchain.replaceChain(newBlockchain.chain);
                expect(blockchain.chain).toEqual(newBlockchain.chain);
            });
        });
    });
    
});

