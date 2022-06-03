const crypto = require('crypto');
const { CREATE_HASH, DIGEST } = require('../config/hashing');

const generateHash = (...inputs)=> {

    const hashCrypto = crypto.createHash(CREATE_HASH);
    hashCrypto.update(inputs.sort().join(' '));
    return hashCrypto.digest(DIGEST);

}

module.exports = generateHash;