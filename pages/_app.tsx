import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { useState } from 'react'
import { ConnectInfo } from '../types/user'
import { MyGlobalContext } from '../context/GlobalContext'
import { Employee } from '../types/user'
import { useRouter } from 'next/router'
import * as ROUTES from '../routes'
import SidebarWithHeader from '../components/common/SidebarWithHeader'
import Footer from '../components/common/Footer'

function MyApp({ Component, pageProps }: AppProps) {
  const [info, setInfo] = useState<ConnectInfo>()
  const [currEmp, setCurrEmp] = useState<Employee>()
  const [currTab, setCurrTab] = useState('empTable')
  const router = useRouter()
  const isLogin = router.pathname === ROUTES.LOGIN

  return (
    <ChakraProvider>
      <MyGlobalContext.Provider
        value={{ info, setInfo, currEmp, setCurrEmp, currTab, setCurrTab }}
      >
        {!isLogin ? (
          <SidebarWithHeader>
            <Component {...pageProps} />
            <Footer />
          </SidebarWithHeader>
        ) : (
          <Component {...pageProps} />
        )}
      </MyGlobalContext.Provider>
    </ChakraProvider>
  )
}

export default MyApp
