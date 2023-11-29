import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'typeface-inter';
import { ScrollToTop } from './ScrollToTop';
import { DexContextProvider } from './context';
import { DeLabContextProvider } from './deLabContext';
import { RecoilRoot } from 'recoil';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/assets/css/app.min.css';
import '../public/assets/libs/fontawesome/css/all.min.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// console.log('test');
// walletService.registerAdapter('ton-wallet', new TonWalletWalletAdapter(tonClient, new TonWalletClient(window)));
// walletService.registerAdapter('tonhub', new TonhubWalletAdapter(new TonhubConnector({network: 'sandbox'})));

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RecoilRoot>
            <DeLabContextProvider>
                <TonConnectUIProvider manifestUrl="https://koala-neutral-jolly.ngrok-free.app/assets/tonconnect-manifest.json">
                    <DexContextProvider>
                        {/* <MemoryRouter> */}
                        <BrowserRouter>
                            <ScrollToTop>
                                <App />
                            </ScrollToTop>
                        </BrowserRouter>
                        {/* </MemoryRouter> */}
                    </DexContextProvider>
                </TonConnectUIProvider>
            </DeLabContextProvider>
        </RecoilRoot>
    </React.StrictMode>
);
