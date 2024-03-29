import {
    useIsConnectionRestored,
    useTonConnectUI,
    useTonWallet,
} from '@tonconnect/ui-react';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useGetPayloadQuery, useLoginQuery } from '../store/api/authApiSlice';
import { removeToken, updateToken } from '../store/features/authSlice';
import { getCookie } from '../utils/cookie';

const TokenCookieKey = import.meta.env.VITE_LOCAL_TOKEN_COOKIE_KEY ?? '';
const REFERRAL_LINK_KEY = 'ref';

const getTokenCookie = () => {
    const token = getCookie(TokenCookieKey);
    return token;
};

export function useAuth() {
    const dispatch = useDispatch();

    const isConnectionRestored = useIsConnectionRestored();
    const wallet = useTonWallet();
    const proof =
        wallet?.connectItems?.tonProof &&
        !('error' in wallet?.connectItems.tonProof)
            ? wallet.connectItems.tonProof.proof
            : null;
    const [tonConnectUI] = useTonConnectUI();

    const { data: payload } = useGetPayloadQuery(undefined, {
        skip: !isConnectionRestored || !!wallet,
        selectFromResult: ({ data }) => ({ data: data ?? null }),
        pollingInterval: 1000 * 60 * 10,
    });
    const { data: loginRequest, error: loginRequestError } = useLoginQuery(
        {
            referral_code: localStorage.getItem(REFERRAL_LINK_KEY) ?? undefined,
            address: wallet?.account.address || '',
            network: Number(wallet?.account.chain),
            proof: {
                timestamp: proof?.timestamp || 0,
                domain: {
                    length_bytes: proof?.domain.lengthBytes || 0,
                    value: proof?.domain.value || '',
                },
                signature: proof?.signature || '',
                payload: proof?.payload || '',
                state_init: wallet?.account?.walletStateInit,
                public_key: wallet?.account?.publicKey,
            },
        },
        {
            skip: !wallet || !proof,
            selectFromResult: ({ data, error }) => ({
                data: data ?? null,
                error,
            }),
        }
    );

    const checkTokenCookieInterval = useRef<
        ReturnType<typeof setInterval> | undefined
    >();

    const removeTokenCookie = () => {
        dispatch(removeToken());
        document.cookie = `${TokenCookieKey}=; max-age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    };

    const checkTokenCookie = () => {
        const token = getTokenCookie();
        if (token && token !== '' && token !== 'None') {
            dispatch(updateToken(token));
            if (!checkTokenCookieInterval.current) {
                checkTokenCookieInterval.current = setInterval(
                    checkTokenCookie,
                    1000 * 30
                );
            }
        } else if (isConnectionRestored && !!wallet) {
            tonConnectUI.disconnect();

            if (checkTokenCookieInterval.current) {
                clearInterval(checkTokenCookieInterval.current);
                checkTokenCookieInterval.current = undefined;
            }
            alert('Your session expired. Please, reconnect.');
        }
    };

    useEffect(() => {
        if (isConnectionRestored && !wallet) {
            removeTokenCookie();
            if (checkTokenCookieInterval.current) {
                clearInterval(checkTokenCookieInterval.current);
                checkTokenCookieInterval.current = undefined;
            }
            return;
        }
    }, [wallet, isConnectionRestored]);

    useEffect(() => {
        checkTokenCookie();
    }, [loginRequest, loginRequestError]);

    useEffect(() => {
        tonConnectUI.setConnectRequestParameters({ state: 'loading' });
        if (!payload) {
            tonConnectUI.setConnectRequestParameters({
                state: 'loading',
            });
        } else {
            tonConnectUI.setConnectRequestParameters({
                state: 'ready',
                value: payload,
            });
        }
    }, [payload]);
}
