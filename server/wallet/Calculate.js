const { STARTING_BALANCE } = require("../config/config");


class Calculate {

    static calculateBalance({chain, address}) {
        let hasCondectedTransaction = false;
        let outputTotal = 0;
    
        for(let i =chain.length-1; i>0; i--){
          const block = chain[i];
    
          for(let transaction of block.data){
            if(transaction.input.address === address){
              hasCondectedTransaction = true; 
            }
            const addressOutput = transaction.outputMap[address];
            if(addressOutput){
              outputTotal = outputTotal + addressOutput;
            }
          }
    
          if(hasCondectedTransaction){
            break;
          }
        }
    
        return hasCondectedTransaction ? outputTotal : STARTING_BALANCE + outputTotal;
    }
}

module.exports = Calculate;