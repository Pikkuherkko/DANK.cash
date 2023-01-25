import { useConnectors, useAccount } from "@starknet-react/core";
import React, { useState } from "react";
import { getApprovals, revoke } from "@/components/starknetFunctions";
import Navbar from "./Navbar";
import Link from "next/link";
import BeatLoader from "react-spinners/BeatLoader";

export default function Approvals() {
  const { account, address, status } = useAccount();
  const [approvals, setApprovals] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [revokeState, setRevokeState] = useState(true);
  const [lastBlocks, setLastBlocks] = useState(0);
  const [amount, setAmount] = useState(0);
  const [found, setFound] = useState(0);
  const [scanning, setScanning] = useState(0);

  const handleClick = async () => {
    setLoading(true);
    await getApprovals(
      address,
      setApprovals,
      lastBlocks,
      setScanning,
      setAmount,
      setFound
    );
    setLoading(false);
  };

  const handleRevoke = async (approval) => {
    setRevokeState(false);
    const receipt = await revoke(approval, account);
    console.log(receipt);
    setRevokeState(true);
  };

  return (
    <div className="flex flex-col justify-between h-screen">
      <div>
        <Navbar />
        <div className="kanit flex items-center flex-col">
          <div className="flex justify-center mt-12 bg-slate-300 py-2 w-1/4 rounded-xl bg-opacity-80">
            {status == "connected" && (
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleClick()}
                  className=" bg-indigo-600 text-white rounded-xl p-2 hover:bg-white hover:text-indigo-600"
                >
                  Get approvals
                </button>
                <div>
                  from the last{" "}
                  <select
                    onChange={(e) => setLastBlocks(e.target.value)}
                    className="bg-slate-200 mt-2 p-1 rounded-xl w-24 text-center font-semibold"
                  >
                    <option value="5000">5 000</option>
                    <option value="20000">20 000</option>
                    <option value="100000">100 000</option>
                  </select>{" "}
                  blocks
                </div>
              </div>
            )}
          </div>
          <div className="mt-24 flex flex-col w-[90%] bg-slate-300 bg-opacity-80 mx-auto rounded-xl py-4">
            <div className="flex flex-row text-center font-bold text-xl">
              <div className="basis-1/4">Spender</div>
              <div className="basis-1/4">Token</div>
              <div className="basis-1/4">Allowance</div>
              <div className="basis-1/4 "></div>
            </div>
            {loading ? (
              <div className="flex justify-center mt-12 flex-col items-center">
                <h2 className="mb-2">
                  Scanning {scanning} / {amount} transactions...
                </h2>
                <BeatLoader />
                <h2 className="mt-2">Found {found} tokens</h2>
              </div>
            ) : (
              approvals && (
                <div className="mt-12 mb-2">
                  {approvals.map((approval, idx) => (
                    <div
                      key={idx}
                      className="flex flex-row text-lg mt-4 text-center"
                    >
                      <Link
                        href={`https://testnet.starkscan.co/contract/${approval.spender}`}
                        className="basis-1/4 hover:text-blue-600 underline"
                        target={"_blank"}
                      >
                        <div className="">
                          {approval.spender.slice(0, 6)}...
                          {approval.spender.slice(62)}
                        </div>
                      </Link>
                      <Link
                        href={`https://testnet.starkscan.co/contract/${approval.token}`}
                        className="basis-1/4 hover:text-blue-600 underline"
                        target={"_blank"}
                      >
                        <div className="basis-1/4">{approval.tokenName}</div>
                      </Link>

                      <div className="basis-1/4">
                        {(approval.allowance / 1e18).toFixed(4)}
                      </div>
                      <div className="basis-1/4">
                        {revokeState ? (
                          <button
                            onClick={() => handleRevoke(approval)}
                            className="bg-black text-white p-2 rounded-xl hover:bg-slate-300 hover:text-red-500"
                          >
                            Revoke
                          </button>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <footer className="text-black flex justify-center mb-2 kanit font-semibold hover:font-bold">
        <Link
          href={"https://github.com/Pikkuherkko/DANK.cash"}
          target={"_blank"}
        >
          Github
        </Link>
      </footer>
    </div>
  );
}
