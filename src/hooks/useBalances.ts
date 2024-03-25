import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { Coins } from "ton3-core";
import { useGetBalancesQuery } from "../store/api/dexApiSlice";
import { useAssets } from "./useAssets";

export type Balances = { [key: string]: Coins };

export const useBalances = () => {
  const wallet = useTonWallet();
  const walletAddress = useTonAddress();

  const { assets } = useAssets();

  const { data: balances } = useGetBalancesQuery(walletAddress, {
    pollingInterval: 1000 * 20,
    skip: !wallet,
  });

  if (!balances || !assets) {
    return {};
  }

  const new_balances: Balances = {};

  for (const address of Object.keys(balances)) {
    if (!assets[address]) {
      continue;
    }
    new_balances[address] = Coins.fromNano(
      balances[address],
      assets[address].decimals
    );
  }

  return new_balances;
};
