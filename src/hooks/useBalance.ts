import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { Coins } from "ton3-core";
import { useGetBalancesQuery } from "../store/api/dexApiSlice";
import { useBalances } from "./useBalances"

const TON_ADDRESS: string = import.meta.env.VITE_TON_ADDRESS;
const TGR_ADDRESS: string = import.meta.env.VITE_TEGRO_ADDRESS;

export interface Balance {
  tonBalance: Coins;
  tgrBalance: Coins;
}

export const useBalance = () => {
  const wallet = useTonWallet();
  const walletAddress = useTonAddress();

  // const { assets } = useAssets();

  const balances = useBalances();

  if (!balances) {
    return {
      tonBalance: Coins.fromNano(0, 9),
      tgrBalance: Coins.fromNano(0, 9),
    };
  }

  return {
    tonBalance: balances[TON_ADDRESS] ?? Coins.fromNano(0,9),
    tgrBalance: balances[TGR_ADDRESS] ?? Coins.fromNano(0,9),
  };
};
