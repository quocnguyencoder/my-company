// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import OracleDB from 'oracledb'
import { ConnectInfo, Employee } from '../../../types/user'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Employee[]>
) {
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

    getConnection().then((connection) => {
      // //console.log(connection)
      connection.execute(
        `SELECT JSON_OBJECT('department' value p.TENPB,'eid' value n.MSNV, 'name' value ten, 'birthdate' value NGAYSINH, 'email' value EMAIL, 'salary' value LUONG, 'taxNumber' value MSTHUE)
       FROM BMCSDL_COMPANY.NHANVIEN n,BMCSDL_COMPANY.CHUCVU C, BMCSDL_COMPANY.PHONGBAN p WHERE n.MSNV = c.MSNV AND c.MSPB = p.MSPB`,
        [],
        function (err, result) {
          if (err) {
            console.error(err.message)
            res.status(500)
          } else {
            const empList = result.rows.map((row) => JSON.parse(row[0]))
            //console.log(empList)
            res.status(200).json(empList as Employee[])
          }
        }
      )
    })
  }
}
