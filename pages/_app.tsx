import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { useState } from 'react'
import { ConnectInfo } from '../types/user'
import { MyGlobalContext } from '../context/GlobalContext'
import { Employee } from '../types/user'

function MyApp({ Component, pageProps }: AppProps) {
  const [info, setInfo] = useState<ConnectInfo>()
  const [currEmp, setCurrEmp] = useState<Employee>()
  const [currTab, setCurrTab] = useState('empTable')
  return (
    <ChakraProvider>
      <MyGlobalContext.Provider
        value={{ info, setInfo, currEmp, setCurrEmp, currTab, setCurrTab }}
      >
        <Component {...pageProps} />
      </MyGlobalContext.Provider>
    </ChakraProvider>
  )
}

export default MyApp
