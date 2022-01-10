export interface AuditTrail {
  timestamp: string
  dbUser: string
  objectName: string
  sqlQuery: string
  statementType: string
}

export interface Department {
  did: number
  dname: string
}

export interface Position {
  eid: number
  position: string
  did: number
}
