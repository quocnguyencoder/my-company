import type { NextPage } from 'next'
import SidebarWithHeader from '../components/common/SidebarWithHeader'
import SmallWithLogo from '../components/common/Footer'
import EmpTable from '../components/EmpTable'
import { useGlobalContext } from '../context/GlobalContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Employee } from '../types/user'

const Home: NextPage = () => {
  const router = useRouter()
  const { info, setCurrEmp } = useGlobalContext()

  useEffect(() => {
    if (info === undefined) {
      router.push('/login')
    } else {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/employees/${info.eid}`, {
            method: 'POST',
            body: JSON.stringify(info),
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const data = await response.json()
          const empList = data as Employee[]
          //console.log(empList)
          setCurrEmp(empList[0])
        } catch (err) {
          console.error(err)
        }
      }
      fetchData()
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
