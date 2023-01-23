import { headers } from "@/next.config";
import {
  Provider,
  Contract,
  Account,
  ec,
  json,
  RpcProvider,
  uint256,
  SequencerProvider,
} from "starknet";
import { hexToString } from "./helpers";

export const getTokenContract = async (address) => {
  try {
    const provider = new RpcProvider({
      nodeUrl: process.env.RPC_URL_2,
    });
    const { abi: abi } = await provider.getClassAt(address);
    if (abi === undefined) {
      throw new Error("no abi.");
    }
    const tokenContract = new Contract(abi, address, provider);
    return tokenContract;
  } catch (error) {
    console.error(error);
  }
};

export const getEvents = async (address, blocks) => {
  try {
    const provider = new RpcProvider({
      nodeUrl: process.env.RPC_URL_2,
    });
    const thisBlock = await provider.getBlock();
    const filter = {
      address: address,
      from_block: { block_number: thisBlock.block_number - blocks },
      to_block: { block_number: thisBlock.block_number },
      chunk_size: 1000,
    };
    const events = await provider.getEvents(filter);
    return events;
  } catch (error) {
    console.error;
  }
};

export const getApprovals = async (
  address,
  setApprovals,
  blocks,
  setScanning,
  setAmount,
  setFound
) => {
  try {
    const events = await getEvents(address, blocks);
    setAmount(events.events.length);
    const txHashes = events.events.map((event) => event.transaction_hash);
    const blockHashes = events.events.map((event) => event.block_hash);

    let approvals = [];
    for (let i = 0; i < txHashes.length; i++) {
      setScanning(i);
      const tx = await callRPC(txHashes[i], blockHashes[i]);
      const spender = await parseTx(tx, address);
      if (spender && spender.allowance > 0) {
        approvals.push(spender);
        await setFound(approvals.length);
      }
    }
    setApprovals(approvals);
  } catch (error) {
    console.error(error);
  }
};

export const getAllowance = async (tokenAddress, address, spender) => {
  try {
    const tokenContract = await getTokenContract(tokenAddress);
    const allowance = await tokenContract.call("allowance", [address, spender]);
    const allowanceToBN = uint256.uint256ToBN(allowance.remaining).toString();
    return allowanceToBN;
  } catch (error) {
    console.log(error);
  }
};

export const revoke = async (approval, account) => {
  try {
    const tokenContract = await getTokenContract(approval.token);
    tokenContract.connect(account);
    const allowanceUint256 = uint256.bnToUint256(approval.allowance);
    const decrease = await tokenContract.invoke("decreaseAllowance", [
      approval.spender,
      allowanceUint256,
    ]);
    return decrease;
  } catch (error) {
    console.log(error);
  }
};

export const parseTx = async (res, address) => {
  try {
    const type = res.calldata[2];
    if (
      type ===
      "0x219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c"
    ) {
      const spender = res.calldata[6];
      const tokenAddress = res.calldata[1];
      const tokenContract = await getTokenContract(tokenAddress);
      const tokenName = await tokenContract.call("name");
      const tokenNameHex = BigInt(tokenName.toString()).toString(16);
      const tokenNameStr = hexToString(tokenNameHex);
      const allowance = await getAllowance(tokenAddress, address, spender);
      return {
        spender: spender,
        token: tokenAddress,
        tokenName: tokenNameStr,
        allowance: allowance,
      };
    }
  } catch (err) {
    console.log(err);
  }
};

export const callRPC = async (txHash, blockHash) => {
  try {
    const provider = new RpcProvider({
      nodeUrl: process.env.RPC_URL_2,
    });
    const res = await provider.getTransactionByHash(txHash);
    return res;
  } catch (err) {
    console.log(err);
  }
};
