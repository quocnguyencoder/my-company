// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import OracleDB from 'oracledb'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const password = 'HR'

  const getConnection = async () => {
    return OracleDB.getConnection({
      user: 'hr',
      password: password,
      connectString:
        '(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.18)(PORT = 1521))(CONNECT_DATA =(SERVICE_NAME= ORCLPDB.LOCALDOMAIN)))',
    })
  }

  getConnection().then((connection) => {
    console.log(connection)
    connection.execute(
      `SELECT *
       FROM countries`,
      [],
      function (err, result) {
        if (err) {
          console.error(err.message)
          return
        }
        console.log(result.rows)
        res.status(200).json({ name: 'John Doe' })
      }
    )
  })
}
