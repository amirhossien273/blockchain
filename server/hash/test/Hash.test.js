const generateHash = require("../Hash");

describe("generateHash()", ()=>{
    it('generates a SHA-256 hashed output', ()=>{
        expect(generateHash('test-data')).toEqual("87879844c02b42cbfafc29991a776565f9b6b709b65af3f291db0a90004ccfab");   
    })
});