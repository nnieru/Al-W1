import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import * as keccak256 from "ethereum-cryptography/keccak";
import {toHex, utf8ToBytes} from "ethereum-cryptography/utils";


function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const message = {
    amount: sendAmount
  }

  const createSignature = (privateKey, message) => {
      const hexMsg = keccak256.keccak256(utf8ToBytes(JSON.stringify(message)));
      const signature = secp.secp256k1.sign(hexMsg, privateKey);
      return signature;
  }
  // const x = createSignature(privateKey, message);

  async function transfer(evt) {
    evt.preventDefault();
    console.log(createSignature(privateKey, message))
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: createSignature(privateKey, message),
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message.toString());
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
