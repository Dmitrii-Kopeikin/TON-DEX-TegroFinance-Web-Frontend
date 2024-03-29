import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { Coins } from "ton3-core";
import { useGetBalancesQuery } from "../store/api/dexApiSlice";
import { useAssets } from "./useAssets";
import { useBalances } from "./useBalances";

export interface PairData {
  token0Address?: string;
  token1Address?: string;
}

export interface usePairBalancesData {
  token0Balance: Coins;
  token1Balance: Coins;
}

export const usePairBalances = (data: PairData) => {

  const { assets } = useAssets();

  const balances = useBalances();

  if (
    !data.token0Address ||
    !data.token1Address ||
    !balances ||
    !assets ||
    !assets[data.token0Address] ||
    !assets[data.token1Address]
  ) {
    return {
      token0Balance: Coins.fromNano(0, 9),
      token1Balance: Coins.fromNano(0, 9),
    };
  }

  const token0Balance = balances[data.token0Address] ?? Coins.fromNano(0, assets[data.token0Address].decimals);
  const token1Balance = balances[data.token1Address] ?? Coins.fromNano(0, assets[data.token1Address].decimals);

  return {
    token0Balance,
    token1Balance,
  };
};
