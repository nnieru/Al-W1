const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes} = require("ethereum-cryptography/utils");

const generatePrivateKey  = () => {
    const privateKey = secp.secp256k1.utils.randomPrivateKey();
    return privateKey;
}

const generatePublicKey = (privateKey) => {
    const publicKey = secp.secp256k1.getPublicKey(privateKey);
    return publicKey;
}

const generateKey = () => {
    const privateKey = generatePrivateKey();
    const publicKey = generatePublicKey(privateKey);
    return {privateKey, publicKey};
}

// const {privateKey, publicKey} = generateKey();

// console.log('private key: ', toHex(privateKey));
// console.log('public key: ', toHex(publicKey));

const str = {
    amount: 10
}
const messageHex = keccak256(utf8ToBytes(JSON.stringify(str)));
const createSignature = () => {
    const privateKey = "b7edc0ed85c120db15e95d4a4ecf99b48c76735aa11d919f40f26ac766f9672a"
    const signature = secp.secp256k1.sign(messageHex, privateKey)

    return signature;
}

const recoverPublicKey = (message, signature) => {
    const recovery = signature.recoverPublicKey(message);
    return toHex(recovery.toRawBytes());
}

const sigature = createSignature()
console.log(createSignature());

const recovery = recoverPublicKey(messageHex, sigature);
console.log(recovery);

// const address = (keccak256(publicKey.slice(1)).slice(-20))


/**
 * PRIVATE & PUBLIC KEY
    private key:  20e5e5983bf1ef97a7d50332cc6e4f670cf81910ac00abf90777282286f404bc
    public key:  02f728beec81f8868429b5cb89913e2573956ba105a9b9a9eee19759dd4972d433

    private key:  2d4a6b659626c814d4509b247af8151267d2c6241c8730ec476694ad33a8e0e7
    public key:  021a4ddf96b3f87773d35737a6452f7c570eeae8d42aa5d2aae1f6a7a18a23b71e 

    private key:  b7edc0ed85c120db15e95d4a4ecf99b48c76735aa11d919f40f26ac766f9672a
    public key:  0333392f832865aac1141de420671aa263ef449337c5d918f83fa9a01cec54da0a 
 */