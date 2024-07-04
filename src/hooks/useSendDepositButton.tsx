import { GLIDE_CONFIG } from '@constants/config'
import { Vault, vaultABI } from '@generationsoftware/hyperstructure-client-js'
import {
  CAIP19,
  chains,
  createSession,
  currencies,
  executeSession
} from '@paywithglide/glide-js'
import { useMutation } from '@tanstack/react-query'
import { Address, parseUnits } from 'viem'
import { useAccount, useSendTransaction, useSignTypedData, useSwitchChain } from 'wagmi'
import { useEthPriceInUsd } from './useEthPrice'


/**
 * Prepares and submits a `deposit` transaction to a vault
 * @param amount the amount to deposit
 * @param vault the vault to deposit into
 * @param options optional callbacks
 * @returns
 */
export const useSendDepositTransaction = (
  amount: bigint,
  vault: Vault,
  currencyType: 'usdc' | 'eth',
  depositChainId: number,

  options?: {
    onSend?: (txHash: `0x${string}`) => void
    onSuccess?: (txHash: `0x${string}`) => void
    onError?: () => void
  }
) => {
  const { address: userAddress } = useAccount()
  const { data: ethPrice } = useEthPriceInUsd()

  const { switchChainAsync } = useSwitchChain()
  const { sendTransactionAsync } = useSendTransaction()
  const { signTypedDataAsync } = useSignTypedData()

  let depositAmount = amount

  const paymentCurrency =
    currencyType == 'usdc'
      ? depositChainId === 10
        ? currencies.usdc
        : currencies.usdc.on(chains.base)
      : (`eip155:${depositChainId}/slip44:60` as CAIP19)

  async function send() {
    if (currencyType === 'eth') {
      let amountInUsd
      if (!ethPrice) amountInUsd = 1
      else amountInUsd = ethPrice * (Number(amount) / 1e6)
      depositAmount = parseUnits(amountInUsd.toString(), 6)
    }

    const parameters = {
      chainId: 10 as 10 | 8453,
      account: userAddress as Address,
      abi: vaultABI,
      address: vault?.address as Address,
      args: [depositAmount, userAddress as Address],
      functionName: 'deposit',
      paymentCurrency
    }

    const session = await createSession(GLIDE_CONFIG, parameters)
    const { sponsoredTransactionHash } = await executeSession(GLIDE_CONFIG, {
      session,
      currentChainId: depositChainId as 10 | 8453,
      switchChainAsync,
      sendTransactionAsync,
      signTypedDataAsync
    })
    return sponsoredTransactionHash
  }

  const { mutate: sendDepositTransaction, isPending } = useMutation({
    mutationFn: async () => {
      const txHash = await send()
      return txHash
    },
    onSuccess: (data: `0x${string}`) => {
      options?.onSuccess?.(data)
    }
  })

  return { isPending, sendDepositTransaction }
}
