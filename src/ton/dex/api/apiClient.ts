import axios from 'axios';
import { Address, Coins } from 'ton3-core';
import {
    Pair, Pairs, Token, Tokens,
} from './types';
import { getLPSupply } from '../utils';

const endpoint = 'https://api.tegro.finance';
// const endpoint = "http://5.188.119.227:8081"

const normalizeToken = (t: any): Token => ({
    image: t.symbol !== 'TON' ? `${endpoint}/tokens/${t.symbol}/image` : 'assets/images/ton.png',
    name: t.name,
    symbol: t.symbol,
    decimals: t.decimals,
    address: new Address(t.address, { bounceable: true }),
});

export const getTokenByAddr = (tokens: Tokens, address: Address) => tokens.find((t) => t.address.eq(address))!;
const getDecimals = (tokens: Tokens, address: Address) => {
    // console.log(tokens, address);
    const token = getTokenByAddr(tokens, address);
    // console.log(token)
    return token.decimals
};

const normalizePair = async (p: any, tokens: Tokens): Promise<Pair> => ({
    lpSupply: await getLPSupply(p.address),
    address: new Address(p.address, { bounceable: true }),
    leftToken: getTokenByAddr(tokens, new Address(p.leftAddress)),
    rightToken: getTokenByAddr(tokens, new Address(p.rightAddress)),
    leftReserved: new Coins(p.leftReserved, {
        isNano: true,
        decimals: getDecimals(tokens, new Address(p.leftAddress)),
    }),
    rightReserved: new Coins(p.rightReserved, {
        isNano: true,
        decimals: getDecimals(tokens, new Address(p.rightAddress)),
    }),
});

const getPairs = async (tokens: Tokens | null): Promise<Pairs> => {
    // const t = tokens ?? await getTokens();
    const t = await getTokens();
    const res = await axios.get(`${endpoint}/pairs`);
    if (res.status !== 200) {
        throw Error(`Received error: ${JSON.stringify(res.data || {})}`);
    }
    // return res.data as Pairs;
    const pairs: Pairs = []
    res.data.forEach(async (item: any) => {
        // console.log(item, t);
        const nPair = await normalizePair(item, t);
        // console.log(pairs)
        pairs.push(await nPair);
    }, []);
    return pairs;
};

const getPair = async (leftSymbol: string, rightSymbol: string, tokens: Tokens | null): Promise<Pair> => {
    const t = tokens ?? await getTokens();
    const res = await axios.get(`${endpoint}/pairs/${leftSymbol}/${rightSymbol}`);
    if (res.status !== 200 || !res.data.updated) {
        throw Error(`Received error: ${JSON.stringify(res.data || {})}`);
    }
    return await normalizePair(res.data, t);
};

const getTokens = async (): Promise<Tokens> => {
    const url = `${endpoint}/tokens`;
    const res = await axios.get(url);
    if (res.status !== 200) {
        throw Error(`Received error: ${JSON.stringify(res.data || {})}`);
    }
    return res.data.reduce((tokens: Tokens, item: any) => {
        const nToken = normalizeToken(item);
        // eslint-disable-next-line no-param-reassign
        tokens.push(nToken);
        return tokens;
    }, []);
};

const getToken = async (symbol = 'TGR'): Promise<Token> => {
    const url = `${endpoint}/tokens/${symbol}`;
    const res = await axios.get(url);
    if (res.status !== 200 || !res.data.updated) {
        throw Error(`Received error: ${JSON.stringify(res.data || {})}`);
    }

    return normalizeToken(res.data);
};

export {
    getPairs,
    getPair,
    getTokens,
    getToken,
};
