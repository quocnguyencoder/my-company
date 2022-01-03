import type { NextPage } from 'next'
import SidebarWithHeader from '../components/common/SidebarWithHeader'
import SmallWithLogo from '../components/common/Footer'
import EmpTable from '../components/EmpTable'

const Home: NextPage = () => {
  return (
    <>
      <SidebarWithHeader>
        <EmpTable />
        <SmallWithLogo />
      </SidebarWithHeader>
    </>
  )
}

export default Home
