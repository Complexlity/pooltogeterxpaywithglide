import {
  NETWORK,
  PRIZE_POOLS,
  VaultInfo,
  VaultList
} from '@generationsoftware/hyperstructure-client-js'
import { chains, createGlideConfig, currencies } from '@paywithglide/glide-js'
import { QueryClient } from '@tanstack/react-query'
import { createPublicClient } from 'viem'
import { createConfig, http } from 'wagmi'
import { base, optimism } from 'wagmi/chains'

export const PRIZE_POOL_INFO = PRIZE_POOLS.find(
  (entry) => entry.chainId === NETWORK.optimism
) as NonNullable<(typeof PRIZE_POOLS)[number]>

export interface Currency {
  on: (chain: Chain) => CAIP19
}

export type Hex = `0x${string}`
export type CAIP2 = `eip155:${number}`
export type CAIP19 = `${CAIP2}/slip44:${number}` | `${CAIP2}/erc20:${Hex}`
export interface Chain {
  readonly id: number
}

export const OPTIMISM_CLIENT = createPublicClient({
  chain: optimism,
  transport: http()
})
export const BASE_CLIENT = createPublicClient({
  chain: base,
  transport: http()
})

export const BASE_USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

export const VAULT_LIST = {
  name: 'PoolTogether Template App Vault List',
  version: { major: 0, minor: 1, patch: 1 },
  timestamp: '2024-04-30T15:33:47Z',
  tokens: [
    {
      chainId: NETWORK.optimism,
      chainName: 'Optimism',
      address: '0x03D3CE84279cB6F54f5e6074ff0F8319d830dafe',
      name: 'Prize USDC',
      logoURI: 'przUSDC.svg',
      currency: currencies.usdc
    },

    {
      chainId: NETWORK.base,
      chainName: 'Base',
      address: '0x7f5C2b379b88499aC2B997Db583f8079503f25b9',
      name: 'Prize USDC',
      logoURI: 'przUSDC.svg',
      currency: currencies.usdc
    }
  ]
} as const satisfies VaultExtended

export type VaultExtended = Omit<VaultList, 'tokens'> & {
  tokens: (VaultInfo & { chainName: string; currency?: Currency })[]
}

export const WAGMI_CONFIG = createConfig({
  chains: [optimism, base],
  multiInjectedProviderDiscovery: false,
  transports: {
    [NETWORK.optimism]: http(),
    [NETWORK.base]: http()
  }
})

declare module 'wagmi' {
  interface Register {
    config: typeof WAGMI_CONFIG
  }
}

const projectId = process.env.NEXT_PUBLIC_GLIDE_PROJECT_ID
if (!projectId) throw new Error('Glide project Id missing from .env')
console.log("https://paywithglide.xyz/")
//https://paywithglide.xyz/

export const GLIDE_CONFIG = createGlideConfig({
  projectId: projectId!,
  chains: [chains.base, chains.optimism]
})

export const QUERY_CLIENT = new QueryClient()
export const DYNAMIC_ENV_ID = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!
if (!DYNAMIC_ENV_ID) throw new Error('Dynamic environment Id missing from .env')
console.log('https://app.dynamic.xyz/dashboard/developer/api')
//https://app.dynamic.xyz/dashboard/developer/api
