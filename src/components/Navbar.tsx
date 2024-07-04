import { DynamicWidget } from "../lib/dynamic";

import classNames from 'classnames'
import Image from 'next/image'

interface NavbarProps {
  className?: string
}

export const Navbar = (props: NavbarProps) => {
  const { className } = props

  return (
    <nav
      className={classNames(
        'w-full flex justify-center p-4 bg-inherit',
        'border-b-2 border-b-pt-purple-700 shadow-2xl',
        className
      )}
    >
      <div className='w-full max-w-screen-xl flex items-center justify-between'>
        <Image
          src='pooltogetherLogo.svg'
          alt='PoolTogether Logo'
          width={133}
          height={52}
          priority={true}
        />
              <DynamicWidget
                  buttonClassName="ctn-btn connect-button"
                  innerButtonComponent={
                      
                      <button className="bg-[#8050E3] text-[#F5F0FF] shadown-md">Connect Wallet</button>
                  }
              />
      </div>
    </nav>
  )
}

// colors: {
//     accentColor: '#8050E3',
//     connectButtonBackground: 'transparent',
//     connectButtonText: '#F5F0FF'
//   },
//   shadows: {
//     connectButton: '0 0 0 transparent'
//   }
