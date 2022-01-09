import { createContext, useContext } from 'react'
import { ConnectInfo } from '../types/user'
import { Employee } from '../types/user'

export type GlobalContent = {
  info: ConnectInfo
  setInfo: (i: ConnectInfo) => void
  currEmp: Employee
  setCurrEmp: (info: Employee) => void
  currTab: string
  setCurrTab: (tab: string) => void
}

export const MyGlobalContext = createContext<GlobalContent>({
  info: {} as ConnectInfo,
  setInfo: () => void 0,
  currEmp: {} as Employee,
  setCurrEmp: () => void 0,
  currTab: '',
  setCurrTab: () => void 0,
})

export const useGlobalContext = () => useContext(MyGlobalContext)
