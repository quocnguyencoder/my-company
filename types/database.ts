export interface AuditTrail {
  timestamp: string
  dbUser: string
  objectName: string
  sqlQuery: string
  statementType: string
}
