import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useTokenBalance, useVaultTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { currencies } from '@paywithglide/glide-js'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Address, formatEther, formatUnits, parseUnits } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import { Loading } from '@components/Loading'
import { BASE_CLIENT, BASE_USDC_ADDRESS, OPTIMISM_CLIENT } from '@constants/config'
import { customFloor, formatTokenAmount } from '@utils/formatting'
import { UniversalDepositButton } from './UniversalDepositButton'

interface VaultDepositFormProps {
  vault: Vault
  className?: string
}

export const UniversalDepositForm = (props: VaultDepositFormProps) => {
  const { vault, className } = props
  const [option, setOption] = useState<'usdc' | 'eth'>('usdc')
  const chainId = useChainId()

  const handleChange = (event: any) => {
    setOption(event.target.value)
  }

  const queryClient = useQueryClient()

  const { address: userAddress } = useAccount()

  const { data: token } = useVaultTokenData(vault)

  const tokenAddress = chainId === 10 ? token?.address : BASE_USDC_ADDRESS

  const {
    data: tokenWithAmount,
    isFetching: isFetchingUserBalance,
    refetch: refetchUserBalance
  } = useTokenBalance(chainId, userAddress as Address, tokenAddress as Address, {
    refetchOnWindowFocus: true
  })

  const { data: userEthBalance, isRefetching } = useQuery({
    queryKey: ['userEthBalance', chainId],
    queryFn: async () => {
      const client = chainId == 10 ? OPTIMISM_CLIENT : BASE_CLIENT
      const balance = await client.getBalance({
        address: userAddress!
      })

      return balance
    },
    enabled: !!(option === 'eth' && userAddress)
  })

  const userBalance = !isFetchingUserBalance ? tokenWithAmount?.amount : undefined

  const { register, formState, setValue, watch, resetField } = useForm<{ tokenAmount: string }>({
    mode: 'onChange',
    defaultValues: { tokenAmount: '' }
  })

  useEffect(() => {
    setValue('tokenAmount', '')
  }, [option])

  const formTokenAmount = watch('tokenAmount')
  const currency = currencies.usdc

  if (!token || !userAddress) {
    return <></>
  }
  const depositAmount =
    !!formTokenAmount && formState.isValid && !!Number(formTokenAmount)
      ? parseUnits(formTokenAmount, token.decimals)
      : 0n
  const errorMsg = formState.errors['tokenAmount']?.message

  function checkBalance(v: string) {
    if (option === 'usdc' && userBalance)
      return parseFloat(formatUnits(userBalance, 6)) >= parseFloat(v)
    else if (option === 'eth' && userEthBalance)
      return parseFloat(formatEther(userEthBalance)) >= parseFloat(v)
  }

  return (
    <div className={classNames('flex flex-col gap-1', className)}>
      {vault.chainId === 10 ? (
        <div className='flex justify-between gap-4 mb-4'>
          <label htmlFor='currency-select' className='min-w-content'>
            Choose a currency:
          </label>
          <select
            id='currency-select'
            className=' text-black flex-1'
            value={option}
            onChange={handleChange}
          >
            <option value='usdc'>USDC</option>
            <option value='eth'>ETH</option>
          </select>
        </div>
      ) : null}
      <div className='flex gap-1 items-center justify-between'>
        <span>Deposit {option.toUpperCase()}</span>
        {userBalance !== undefined && option == 'usdc' ? (
          <button
            onClick={() => setValue('tokenAmount', formatUnits(userBalance, token.decimals))}
            className='text-sm text-pt-purple-100 hover:text-pt-purple-200'
          >
            Max ({formatTokenAmount(userBalance, token.decimals)} {token.symbol})
          </button>
        ) : userEthBalance !== undefined && option == 'eth' && !isRefetching ? (
          <button onClick={() => {}} className='text-sm text-pt-purple-100  cursor-default'>
            Max ({customFloor(Number(formatEther(userEthBalance)))} {'ETH'})
          </button>
        ) : (
          <Loading className='h-2' />
        )}
      </div>
      <div className='flex'>
        <input
          id='tokenAmount'
          placeholder='0'
          {...register('tokenAmount', {
            validate: {
              isValidNumber: (v) => !Number.isNaN(Number(v)) || 'Enter a valid number',
              isGreaterThanOrEqualToZero: (v) =>
                parseFloat(v) >= 0 || 'Enter a valid positive number',
              isNotTooPrecise: (v) =>
                v.split('.').length < 2 ||
                v.split('.')[1].length <= token.decimals ||
                'Too many decimals',
              isNotGreaterThanBalance: (v) =>
                (userBalance === undefined && userEthBalance == undefined) ||
                checkBalance(v) ||
                `Not enough ${option == 'eth' ? 'ETH' : token.symbol} in wallet`
            }
          })}
          className='grow px-2 py-0.5 bg-pt-purple-50 text-pt-purple-900 rounded-l'
        />
        <UniversalDepositButton
          vault={vault}
          depositAmount={depositAmount}
          currencyType={option}
          onSuccess={() => {
            resetField('tokenAmount')
            refetchUserBalance()
            queryClient.invalidateQueries({
              queryKey: ['userEthBalance']
            })
          }}
        />
      </div>
      <span className='h-4 text-xs text-pt-warning-light'>{errorMsg}</span>
    </div>
  )
}
