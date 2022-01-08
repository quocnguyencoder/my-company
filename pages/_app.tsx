import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { useState } from 'react'
import { ConnectInfo } from '../types/user'
import { MyGlobalContext } from '../context/GlobalContext'

function MyApp({ Component, pageProps }: AppProps) {
  const [info, setInfo] = useState<ConnectInfo>()
  return (
    <ChakraProvider>
      <MyGlobalContext.Provider value={{ info, setInfo }}>
        <Component {...pageProps} />
      </MyGlobalContext.Provider>
    </ChakraProvider>
  )
}

export default MyApp
