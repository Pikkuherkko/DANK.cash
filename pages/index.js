import { useConnectors, useAccount } from "@starknet-react/core";
import { Provider, Contract, Account, ec, json, RpcProvider } from "starknet";
import React, { useState, useEffect } from "react";

export default function Home() {
  const { account, address, status } = useAccount();
  const { connect, connectors } = useConnectors();
  const [events, setEvents] = useState(undefined);

  const getEvents = async () => {
    const provider = new RpcProvider({
      nodeUrl:
        "https://nd-553-500-534.p2pify.com/f9537303464baa818fd73f9b7d760a08",
    });
    const thisBlock = await provider.getBlockNumber();
    console.log(thisBlock);
    const filter = {
      address:
        "0x05A8CdF138a6A51f11b5a7dcDc3BfC76E0b8314a0DeC38B7eB39A13D206e977a",
      from_block: { block_number: thisBlock - 1000 },
      to_block: { block_number: thisBlock },
      chunk_size: 1000,
    };
    const events = await provider.getEvents(filter);
    console.log(events);
    return events;
  };

  const getTypes = async () => {
    const events = await getEvents();
    const hashes = events.events.map((event) => event.transaction_hash);

    console.log(hashes);
    for (let i = 0; i < hashes.length; i++) {
      let type = await callAPI(hashes[i]);
      console.log(type);
    }
  };

  // const receipt = async (hash) => {
  //   const provider = new RpcProvider({
  //     nodeUrl:
  //       "https://nd-553-500-534.p2pify.com/f9537303464baa818fd73f9b7d760a08",
  //   });
  //   const rec = await provider.getTransactionReceipt(hash);
  //   console.log("rec", rec);
  //   let eventType;
  //   if (
  //     (rec.events[0].keys[0] =
  //       "0x134692b230b9e1ffa39098904722134159652b09c5bc41d88d6698779d228ff")
  //   ) {
  //     eventType = "Approval";
  //   } else {
  //     eventType = "I dont know";
  //   }
  //   return eventType;
  // };

  const callAPI = async (hash) => {
    try {
      const res = await fetch(
        `https://goerli.voyager.online/api/txn/${hash}/trace`
      );
      const data = await res.json();
      const type =
        data.functionInvocationTrace.internal_calls[0].internal_calls[0].name;
      console.log("type", type);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="">
      <div className="flex flex-row">
        {connectors.map((connector) => (
          <div key={connector.id()} className="">
            <button
              onClick={() => connect(connector)}
              className="bg-orange-500 ml-2 p-2 rounded-xl hover:bg-black hover:text-orange-500"
            >
              Connect {connector.id()}
            </button>
          </div>
        ))}
      </div>
      <div>
        <button onClick={getTypes} className="text-black mt-48">
          Get events
        </button>
      </div>
      {events && (
        <div>
          {events.map((spender) => (
            <div>{spender}</div>
          ))}
        </div>
      )}
    </div>
  );
}
