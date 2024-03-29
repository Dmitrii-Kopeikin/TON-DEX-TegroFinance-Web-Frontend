import { useEffect, useState } from 'react';
import { isErrorResponse } from '../store/api/common';
import { useSimulateSwapQuery } from '../store/api/dexApiSlice';

export interface SimulateRequestData {
    swapAction: 'offer' | 'ask';
    offerAddress?: string;
    askAddress?: string;
    fromUnits: string;
    toUnits: string;
    slippageTolerance: number;
}

export interface SimulateSwapState {
    error?: string;
    swapRate: number;
    minAskUnits: string;
    offerUnits: string;
    askUnits: string;
    tonFeeUnits: string;
    priceImpact: number;
}

const simulateSwapStateInitialData: SimulateSwapState = {
    swapRate: 0,
    minAskUnits: '0',
    offerUnits: '0',
    askUnits: '0',
    tonFeeUnits: '0',
    priceImpact: 0,
};

export const useSimulateSwap = (data: SimulateRequestData) => {
    const [simulateState, setSimulateState] = useState(
        simulateSwapStateInitialData
    );

    const { data: simulateData } = useSimulateSwapQuery(
        {
            swapAction: data.swapAction,
            offer_address: data.offerAddress ?? '',
            ask_address: data.askAddress ?? '',
            units: data.swapAction == 'offer' ? data.fromUnits : data.toUnits,
            slippage_tolerance: data.slippageTolerance,
        },
        {
            skip:
                !data.askAddress ||
                !data.offerAddress ||
                (data.swapAction == 'offer' && data.fromUnits === '0') ||
                (data.swapAction == 'ask' && data.toUnits === '0'),
            pollingInterval: 1000 * 5,
            selectFromResult: ({ data }) => ({ data: data ?? null }),
            refetchOnMountOrArgChange: true,
        }
    );

    useEffect(() => {
        if (!simulateData) {
            return;
        }

        if (isErrorResponse(simulateData)) {
            setSimulateState({
                ...simulateSwapStateInitialData,
                error: simulateData.code.toString(),
            });
        } else {
            setSimulateState({
                swapRate: simulateData.swap_rate,
                minAskUnits: simulateData.min_ask_units,
                offerUnits: simulateData.offer_units,
                askUnits: simulateData.ask_units,
                tonFeeUnits: simulateData.ton_fee_units,
                priceImpact: simulateData.price_impact,
            });
        }
    }, [simulateData]);

    const showSimulateError = () => {
        if (simulateState.error) {
            const error = simulateState.error;
            setSimulateState({ ...simulateState, error: undefined });
            alert(error);
        }
    };

    return { simulateState, showSimulateError };
};
