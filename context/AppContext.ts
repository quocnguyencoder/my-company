import { createContext, useContext } from 'react'
import { Employee } from '../types/user'

export type AppContext = {
  currEmp: Employee
  setCurrEmp: (info: Employee) => void
  currTab: string
  setCurrTab: (tab: string) => void
}

export const MyAppContext = createContext<AppContext>({
  currEmp: {} as Employee, // set a default value
  setCurrEmp: () => void 0,
  currTab: 'empTable',
  setCurrTab: () => void 0,
})

export const useAppContext = () => useContext(MyAppContext)
