const generateHash = require("../Hash");

describe("generateHash()", ()=>{
    it('generates a SHA-256 hashed output', ()=>{
        expect(generateHash('test-data')).toEqual("a186000422feab857329c684e9fe91412b1a5db084100b37a98cfc95b62aa867");   
    })
});