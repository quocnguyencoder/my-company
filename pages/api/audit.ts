// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import OracleDB from 'oracledb'
import { ConnectInfo } from '../../types/user'
import { AuditTrail } from '../../types/database'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuditTrail[]>
) {
  return new Promise<void>((resolve) => {
    if (req.method === 'POST') {
      const info = req.body as ConnectInfo
      //console.log(info)
      const getConnection = async () => {
        return OracleDB.getConnection({
          user: info.username,
          password: info.password,
          connectString: `(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = ${info.ip})(PORT = 1521))(CONNECT_DATA =(SERVICE_NAME= ${info.svName})))`,
        })
      }

      getConnection()
        .then((connection) => {
          connection.execute(
            `SELECT JSON_OBJECT('timestamp' value extended_timestamp,'dbUser' value DB_USER,
                                'objectName' value OBJECT_NAME,'sqlQuery' value SQL_TEXT,'statementType' value statement_type)
            FROM DBA_FGA_AUDIT_TRAIL`,
            [],
            function (err, result) {
              try {
                connection.close()
              } catch (err) {
                console.error(err)
              }
              if (err) {
                console.error(err.message)
                res.status(500).end()
              } else {
                const auditList = result.rows.map((row) => JSON.parse(row[0]))
                res.json(auditList as AuditTrail[])
                res.status(200).end()
              }
              return resolve()
            }
          )
        })
        .catch((err) => {
          console.error(err.message)
          res.status(500).end()
          return resolve()
        })
    }
  })
}
