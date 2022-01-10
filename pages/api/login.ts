// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import OracleDB from 'oracledb'
import { ConnectInfo } from '../../types/user'

type Data = {
  eid: number
}
type Message = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Message>
) {
  return new Promise<void>((resolve) => {
    if (req.method === 'POST') {
      const info = req.body.info as ConnectInfo
      //console.log(req.body)
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
            `SELECT MSNV
            FROM BMCSDL_COMPANY.TAIKHOAN 
            WHERE USERNAME = :username`,
            [info.username],
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
                res.json({ eid: result.rows[0][0] })
                res.status(200).end()
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
