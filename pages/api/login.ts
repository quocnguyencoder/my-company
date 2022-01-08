// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import OracleDB from 'oracledb'
import { ConnectInfo } from '../../types/user'

type Data = {
  eid: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
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
            `SELECT MSNV
       FROM BMCSDL_COMPANY.TAIKHOAN WHERE USERNAME = '${info.username}'`,
            [],
            function (err, result) {
              try {
                connection.close()
              } catch (err) {
                console.error(err)
              }
              if (err) {
                //console.error(err.message)
                res.status(500).end()
              } else {
                res.json({ eid: result.rows[0][0] })
                res.status(200).end()
              }
              return resolve()
            }
          )
        })
        .catch(() => {
          res.status(500).end()
          return resolve()
        })
    }
  })
}
