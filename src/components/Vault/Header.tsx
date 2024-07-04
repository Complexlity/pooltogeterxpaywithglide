import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultShareData } from '@generationsoftware/hyperstructure-react-hooks'
import classNames from 'classnames'
import Image from 'next/image'
import { Loading } from '@components/Loading'

interface VaultHeaderProps {
  vault: Vault 
  className?: string,
  chainName: string
}

export const VaultHeader = (props: VaultHeaderProps) => {
  const { vault, className , chainName} = props

  const { data: shareToken } = useVaultShareData(vault)

  const vaultName = vault.name ?? shareToken?.name

  return (
    <div className={classNames('flex gap-2 items-center', className)}>
      <Image
        src={vault.logoURI ?? ''}
        alt={`${vaultName} Logo`}
        width={24}
        height={24}
        className='w-8'
      />
      <span className='font-medium text-xl'>{vaultName ? vaultName + " " + chainName : <Loading className='h-3' />}</span>
    </div>
  )
}
