import { VaultInfo } from '@generationsoftware/hyperstructure-client-js'
import { useVault } from '@generationsoftware/hyperstructure-react-hooks'
import classNames from 'classnames'
import { VaultBalance } from './Balance'
import {  UniversalDepositForm } from './UniversalDepositForm'
import { VaultHeader } from './Header'
import { VaultUserBalance } from './UserBalance'
import { VaultWithdrawForm } from './WithdrawForm'
import { Currency } from '@paywithglide/glide-js'

interface T  {
  chainName: string
  currency: Currency
}

interface VaultProps extends VaultInfo, T {
  className?: string
}

export const UniversalDepositVault = (props: VaultProps) => {
  const { chainName, currency, className, ...rest } = props

  const vault = useVault({ ...rest })

  return (
    <span
      className={classNames('flex flex-col gap-4 px-4 py-6 bg-pt-purple-800 rounded-lg', className)}
    >
      <VaultHeader vault={vault} chainName={chainName} />
      <hr className='border-pt-purple-600' />
      <VaultUserBalance vault={vault} />
      <VaultBalance vault={vault} />
      <UniversalDepositForm vault={vault} />
      <VaultWithdrawForm vault={vault} />
    </span>
  )
}
