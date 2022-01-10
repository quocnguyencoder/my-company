// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import OracleDB from 'oracledb'
import { ConnectInfo } from '../../types/user'
import { Department } from '../../types/database'

interface Message {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Department[] | Message>
) {
  return new Promise<void>((resolve) => {
    if (req.method === 'POST') {
      const info = req.body.info as ConnectInfo
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
            `SELECT JSON_OBJECT('did' value MSPB,'dname' value TENPB)
            FROM BMCSDL_COMPANY.PHONGBAN`,
            [],
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
                const depList = result.rows.map((row) => JSON.parse(row[0]))
                res.json(depList as Department[])
                //console.log(depList)
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
