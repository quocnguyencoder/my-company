import type { NextPage } from 'next'
import SidebarWithHeader from '../components/common/SidebarWithHeader'
import SmallWithLogo from '../components/common/Footer'
import EmpTable from '../components/EmpTable'
import { useGlobalContext } from '../context/GlobalContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'

const Home: NextPage = () => {
  const router = useRouter()
  const { info } = useGlobalContext()

  useEffect(() => {
    if (info === undefined) {
      router.push('/login')
    }
  }, [])

  return info !== undefined ? (
    <>
      <SidebarWithHeader>
        <EmpTable />
        <SmallWithLogo />
      </SidebarWithHeader>
    </>
  ) : (
    <></>
  )
}

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
})
