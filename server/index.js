const express = require("express");
const app = express();
const cors = require("cors");
const port = 3043;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes} = require("ethereum-cryptography/utils");



const recoverPublicKey = (message, signature) => {
    const recovery = signature.recoverPublicKey(message);
    return toHex(recovery.toRawBytes());
}

const messageGenerator = (message) => {
    const messageHex = keccak256(utf8ToBytes(JSON.stringify(message)));
    return messageHex;
}

app.use(cors());
app.use(express.json());

// address will be the public key
const balances = {
  "02f728beec81f8868429b5cb89913e2573956ba105a9b9a9eee19759dd4972d433": 100, // dan
  "021a4ddf96b3f87773d35737a6452f7c570eeae8d42aa5d2aae1f6a7a18a23b71e": 50, // al
  "0333392f832865aac1141de420671aa263ef449337c5d918f83fa9a01cec54da0a": 75, // ben
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  /**
    Todo:
      - get a signature from client side application
      - recover the public address from the signature
   */
  const { sender, recipient, amount } = req.body;
  // sender will be a signature
  const sign = {
    r: sender["r"],
    s: sender["s"],
    recovery: sender["recovery"],
  }

  // recovery sender public address
  const message = {
    amount: amount
  }

  const publicAddr = recoverPublicKey(messageGenerator(message), sign);
  console.log(publicAddr);

  setInitialBalance(publicAddr);
  setInitialBalance(recipient);

  if (balances[publicAddr] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[publicAddr] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[publicAddr] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
