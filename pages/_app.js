import "@/styles/globals.css";
import { StarknetConfig, InjectedConnector } from "@starknet-react/core";

export default function MyApp({ Component, pageProps }) {
  const connectors = [
    new InjectedConnector({ options: { id: "braavos" } }),
    new InjectedConnector({ options: { id: "argentX" } }),
  ];
  return (
    <StarknetConfig connectors={connectors}>
      <Component {...pageProps} />
    </StarknetConfig>
  );
}
