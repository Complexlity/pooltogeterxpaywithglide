import React from 'react'
import { useAccount, useSwitchChain } from 'wagmi'

type buttonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export interface TransactionbuttonProps extends Omit<buttonProps, 'onClick'> {
  chainId: number
  disabled: boolean
  isTxLoading: boolean
  write: () => void

  openConnectModal?: () => void
  openChainModal?: () => void
}

function getNiceNetworkNameByChainId(chainId: number) {
  switch (chainId) {
    case 10:
      return 'Optimism'
    default:
      return 'Base'
  }
}

function Spinner() {
  return <span>Loading...</span>
}

export const Transactionbutton = (props: TransactionbuttonProps) => {
  const {
    chainId,
    isTxLoading,
    write,
    disabled,
    openConnectModal,
    openChainModal,

    children,
    ...rest
  } = props

  const { chain, isDisconnected } = useAccount()

  const { switchChain, isPending: isSwitchingChain } = useSwitchChain()

  const networkName = getNiceNetworkNameByChainId(chainId)

  if (isDisconnected) {
    return (
      <button onClick={openConnectModal} {...rest}>
        <span>Connect Wallet</span>
      </button>
    )
  } else if (!(chain && [10, 8453].includes(chain?.id))) {
    return (
      <button
        onClick={() =>
          //@ts-expect-error
          !!switchChain ? switchChain({ chainId }) : !!openChainModal ? openChainModal() : undefined
        }
        disabled={isSwitchingChain}
        {...rest}
      >
        {isSwitchingChain && <span> Switching to {networkName}</span>}
        {!isSwitchingChain && <span>Switch to {networkName}</span>}
      </button>
    )
  }

  return (
    <button onClick={write} disabled={!write || isTxLoading || disabled} {...rest}>
      <span>
        {isTxLoading && <Spinner />}
        {!isTxLoading && children}
      </span>
    </button>
  )
}
