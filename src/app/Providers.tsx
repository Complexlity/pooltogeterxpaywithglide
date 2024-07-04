'use client'

import { DYNAMIC_ENV_ID, QUERY_CLIENT, WAGMI_CONFIG } from '@constants/config'
import { QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import {
  DynamicContextProvider,
  DynamicWagmiConnector,
  EthereumWalletConnectors
} from '../lib/dynamic'

export function Providers(props: { children: ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_ENV_ID,
        walletConnectors: [EthereumWalletConnectors]
      }}
    >
      <WagmiProvider config={WAGMI_CONFIG}>
        <QueryClientProvider client={QUERY_CLIENT}>
          <DynamicWagmiConnector>{props.children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  )
}
