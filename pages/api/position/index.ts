// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import OracleDB from 'oracledb'
import { Position } from '../../../types/database'
import { ConnectInfo } from '../../../types/user'

interface Message {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message>
) {
  return new Promise<void>((resolve) => {
    const info = req.body.info as ConnectInfo

    const getConnection = async () => {
      return OracleDB.getConnection({
        user: info.username,
        password: info.password,
        connectString: `(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = ${info.ip})(PORT = 1521))(CONNECT_DATA =(SERVICE_NAME= ${info.svName})))`,
      })
    }
    if (req.method === 'POST') {
      const data = req.body.data as Position
      getConnection()
        .then((connection) => {
          connection.execute(
            `INSERT INTO BMCSDL_COMPANY.CHUCVU VALUES(:eid,:position,:did)`,
            [data.eid, data.position, data.did],
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
                if (result.rowsAffected === 0) {
                  res.status(500).json({ message: 'Nothing was inserted' })
                } else {
                  res.json({ message: `Inserted successfully!` })
                  res.status(200).end()
                }
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
