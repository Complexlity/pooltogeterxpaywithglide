'use client'

import { useEffect, useState } from 'react'
import { GrandPrize } from '@components/GrandPrize'

import { VAULT_LIST } from '@constants/config'
import { UniversalDepositVault } from '@components/Vault'
import { currencies } from '@paywithglide/glide-js'
import { NETWORK } from '@generationsoftware/hyperstructure-client-js'

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  const vault =     {
    chainId: NETWORK.optimism,
    chainName: 'Optimism',
    address: '0x03D3CE84279cB6F54f5e6074ff0F8319d830dafe' as `0x${string}`,
    name: 'Prize USDC',
    logoURI: 'przUSDC.svg',
    currency: currencies.usdc
  }


  return (
    <>
      <GrandPrize className='my-12' />
      <div className='flex gap-8 flex-wrap'>
        {isMounted &&
          <UniversalDepositVault {...vault} />}
      </div>
    </>
  )
}
