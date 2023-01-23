import { RpcProvider } from "starknet";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const txHash = req.body.txHash;
    const blockHash = req.body.blockHash;
  }
  const tx = await callRPC(txHash, blockHash);
  res.status(200).json({ tx: tx });
}

export const callRPC = async (txHash, blockHash) => {
  try {
    // const res = await fetch(
    //   `https://goerli.voyager.online/api/txn/${hash}/trace`
    // );
    const provider = new RpcProvider({
      nodeUrl:
        "https://starknet-goerli.infura.io/v3/c1f3a15429184cf5813abf5b28218961",
    });
    const res = await provider.getTransactionByHash(txHash);
    console.log(res);
    return res;
    // const type = res.calldata[2];
    // if (
    //   type ===
    //   "0x219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c"
    // ) {
    //   const spender = res.calldata[6];
    //   const tokenAddress = res.calldata[1];
    //   const tokenContract = await getTokenContract(tokenAddress);
    //   const tokenName = await tokenContract.call("name");
    //   const tokenNameHex = BigInt(tokenName.toString()).toString(16);
    //   const tokenNameStr = hexToString(tokenNameHex);
    //   const allowance = await getAllowance(tokenAddress, address, spender);
    //   console.log("type", type, "token", tokenAddress, "spender", spender);
    //   return {
    //     spender: spender,
    //     token: tokenAddress,
    //     tokenName: tokenNameStr,
    //     allowance: allowance,
    //   };
    // }
  } catch (err) {
    console.log(err);
  }
};
