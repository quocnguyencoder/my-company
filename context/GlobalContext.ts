import { createContext, useContext } from 'react'
import { ConnectInfo } from '../types/user'

export type GlobalContent = {
  info: ConnectInfo
  setInfo: (i: ConnectInfo) => void
}

export const MyGlobalContext = createContext<GlobalContent>({
  info: {} as ConnectInfo, // set a default value
  setInfo: () => void 0,
})

export const useGlobalContext = () => useContext(MyGlobalContext)
