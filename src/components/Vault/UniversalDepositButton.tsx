import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useUserVaultTokenBalance,
  useVaultBalance
} from '@generationsoftware/hyperstructure-react-hooks'
import { Currency } from '@paywithglide/glide-js'
import classNames from 'classnames'
import { Address } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import { useSendDepositTransaction } from '@hooks/useSendDepositButton'
import { Transactionbutton } from './TransactionButton'

interface VaultDepositButtonProps {
  vault: Vault
  className?: string
}

export const UniversalDepositButton = (
  props: VaultDepositButtonProps & {
    depositAmount: bigint
    currencyType: 'usdc' | 'eth'
    disabled?: boolean
    onSuccess?: () => void
  }
) => {
  const { vault, depositAmount, disabled, onSuccess, className, currencyType } = props

  const { address: userAddress } = useAccount()

  const { data: token, refetch: refetchVaultBalance } = useVaultBalance(vault)
  const { refetch: refetchUserVaultBalance } = useUserVaultTokenBalance(
    vault,
    userAddress as Address
  )

  const depositChainId = useChainId()

  const { isPending: isDepositing, sendDepositTransaction } = useSendDepositTransaction(
    depositAmount,
    vault,
    currencyType,
    depositChainId,
    {
      onSuccess: () => {
        refetchVaultBalance()
        refetchUserVaultBalance()
        onSuccess?.()
      }
    }
  )

  const buttonClassName =
    'px-2 py-0.5 bg-pt-teal-dark text-pt-purple-900 rounded select-none disabled:opacity-50 disabled:pointer-events-none'

  if (!depositAmount || !userAddress || !token) {
    return (
      <button className={classNames(buttonClassName, className)} disabled={true}>
        Deposit
      </button>
    )
  }

  return (
    <Transactionbutton
      chainId={vault.chainId}
      disabled={isDepositing}
      className={classNames(buttonClassName, className)}
      isTxLoading={isDepositing}
      write={sendDepositTransaction}
    >
      Deposit
    </Transactionbutton>
  )
}
