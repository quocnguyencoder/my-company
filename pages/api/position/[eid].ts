// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import OracleDB from 'oracledb'
import { ConnectInfo } from '../../../types/user'

interface Message {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message>
) {
  return new Promise<void>((resolve) => {
    const { eid } = req.query
    const info = req.body.info as ConnectInfo

    const getConnection = async () => {
      return OracleDB.getConnection({
        user: info.username,
        password: info.password,
        connectString: `(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = ${info.ip})(PORT = 1521))(CONNECT_DATA =(SERVICE_NAME= ${info.svName})))`,
      })
    }
    if (req.method === 'PUT') {
      const did = req.body.did as number
      getConnection()
        .then((connection) => {
          connection.execute(
            `UPDATE BMCSDL_COMPANY.CHUCVU
                SET MSPB =:did WHERE MSNV = :eid`,
            [did, eid] as OracleDB.BindParameters[],
            { autoCommit: true },
            function (err, result) {
              try {
                connection.close()
              } catch (err) {
                console.error(err)
              }
              if (err) {
                console.error(err.message)
                res.status(500).json({ message: err.message })
              } else {
                //console.log(result)
                if (result.rowsAffected === 0) {
                  res.status(500).json({ message: 'Nothing was updated' })
                } else {
                  res.json({ message: `Update successfully!` })
                  res.status(200).end()
                }
              }
              return resolve()
            }
          )
        })
        .catch((err) => {
          console.error(err.message)
          res.status(500).json({ message: err.message })
          return resolve()
        })
    }
  })
}
