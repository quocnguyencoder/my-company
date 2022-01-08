export interface ConnectInfo {
  ip: string
  svName: string
  username: string
  password: string
  eid: number
}

export interface Employee {
  eid: string
  name: string
  email: string
  birthdate: Date
  salary: number
  taxNumber: string
  department: string
  position: string
}
