import classNames from 'classnames'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './Providers'
import { Navbar } from '@components/Navbar'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Pool X Glide",
  description:
    'A minimal application integrating pool protocol with paywith glide. Pay into optimism protocol with op and base tokens'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body
        className={classNames(
          'w-full flex flex-col items-center bg-pt-bg-purple-darker text-pt-purple-50',
          inter.className
        )}
      >
        <Providers>
          
        <div className='min-w-[100vw]'>
            <Navbar className='z-50' />
            <main className='w-full flex flex-col gap-4 items-center px-4 py-8'>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
