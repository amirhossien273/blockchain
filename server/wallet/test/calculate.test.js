const Blockchain = require("../../blockchain/Blockchain");
const { STARTING_BALANCE } = require("../../config/config");
const Calculate = require("../Calculate");
const Wallet = require("../Wallet");
const Transaction = require("../Transaction");

describe("Calculat", ()=>{
   let calculate, blockchain, wallet;

   beforeEach(()=>{
       calculate = new Calculate();
       blockchain = new Blockchain();
       wallet = new Wallet();
   });

   describe("calculateBalance()", ()=>{
       
        describe("and there are no outputs for the wallet", ()=>{
            
            it("return the `STARTING_BALANCE`", ()=>{

                expect(Calculate.calculateBalance({
                    chain: blockchain.chain,
                    address: wallet.publicKey
                })).toEqual(STARTING_BALANCE);
            });
        });

        describe("and there are outputs for the wallet", ()=>{
            
            let transactionOne, transactionTwo;

            beforeEach(()=>{
              transactionOne = new Wallet().createTransaction({
                recipient: wallet.publicKey,
                amount: 50
              });
      
              transactionTwo = new Wallet().createTransaction({
                recipient: wallet.publicKey,
                amount: 60
              });
      
              blockchain.addBlock({data: [transactionOne, transactionTwo]})
            })
      
            it('adds the sum of all outputs to the wallet balnace', ()=>{
              expect(
                Calculate.calculateBalance({
                chain: blockchain.chain,
                address: wallet.publicKey
              })).toEqual(STARTING_BALANCE + transactionOne.outputMap[wallet.publicKey] + transactionTwo.outputMap[wallet.publicKey])
            })
        });


        describe('and the wallet has made a transaction', ()=>{
            let recentTransaction;
    
            beforeEach(()=>{
              recentTransaction = wallet.createTransaction({
                recipient: 'foo-address',
                amount: 30
              });
              blockchain.addBlock({data: [recentTransaction]})
            });
    
            it('returns the output amount of the recent transaciton', ()=>{
              expect(Calculate.calculateBalance({
                chain: blockchain.chain,
                address: wallet.publicKey
              })).toEqual(recentTransaction.outputMap[wallet.publicKey]);
            });
        });
        
        describe('and there are outputs next to and after the recent transaction', ()=>{
            let sameBlockTransaction, nextBlockTransaction;
  
            beforeEach(()=>{
              recentTransaction = wallet.createTransaction({
                recipient: 'later-foo-address',
                amount: 60
              });
  
              sameBlockTransaction = Transaction.rewardTransaction({minerWallet: wallet});
  
              blockchain.addBlock({data: [recentTransaction, sameBlockTransaction]});
              nextBlockTransaction = new Wallet().createTransaction({
                recipient: wallet.publicKey, amount: 75
              });
  
              blockchain.addBlock({data: [nextBlockTransaction]});
            });
  
            it('inculdes the output amount s in the returned balance', ()=>{
              expect(Calculate.calculateBalance({
                chain: blockchain.chain,
                address: wallet.publicKey
              })).toEqual(
                recentTransaction.outputMap[wallet.publicKey] +
                sameBlockTransaction.outputMap[wallet.publicKey] +
                nextBlockTransaction.outputMap[wallet.publicKey]
              )
            });
        });
          
    });
})