import { useConnectors, useAccount } from "@starknet-react/core";
import { useEffect } from "react";

const Navbar = () => {
  const { account, address, status } = useAccount();
  const { connect, connectors } = useConnectors();

  useEffect(() => {
    try {
      if (status !== "connected") connect(connectors[1]);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="flex flex-row justify-between">
      <h1 className="rubik text-4xl m-4 text-white">DANK.cash</h1>
      <div className="flex flex-row mt-2 mr-4 h-fit">
        {status == "connected" ? (
          <button className="bg-indigo-600 text-white p-2 rounded-xl">
            Connected
          </button>
        ) : (
          connectors.map((connector) => (
            <div key={connector.id()} className="">
              <button
                onClick={() => connect(connector)}
                className="bg-indigo-600 text-white ml-2 p-2 rounded-xl hover:bg-black hover:text-orange-500"
              >
                Connect {connector.id()}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Navbar;
