// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import OracleDB from 'oracledb'
import { ConnectInfo, Employee } from '../../../types/user'

interface Message {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Employee[] | Message>
) {
  return new Promise<void>((resolve) => {
    const info = req.body.info as ConnectInfo
    //console.log(info)
    const getConnection = async () => {
      return OracleDB.getConnection({
        user: info.username,
        password: info.password,
        connectString: `(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = ${info.ip})(PORT = 1521))(CONNECT_DATA =(SERVICE_NAME= ${info.svName})))`,
      })
    }
    if (req.method === 'POST') {
      getConnection()
        .then((connection) => {
          connection.execute(
            `SELECT JSON_OBJECT('department' value p.TENPB,'eid' value n.MSNV, 
            'name' value ten, 'birthdate' value NGAYSINH, 'email' value EMAIL, 
            'salary' value LUONG, 'taxNumber' value MSTHUE, 'position' value c.CHUCVU)
            FROM BMCSDL_COMPANY.NHANVIEN n LEFT OUTER JOIN BMCSDL_COMPANY.CHUCVU C 
            ON n.MSNV = c.MSNV
            LEFT OUTER JOIN BMCSDL_COMPANY.PHONGBAN p 
            ON c.MSPB = p.MSPB`,
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
                const empList = result.rows.map((row) => JSON.parse(row[0]))
                //console.log(empList)
                res.json(empList as Employee[])
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
    } else if (req.method === 'PUT') {
      const data = req.body.data as Employee
      getConnection()
        .then((connection) => {
          connection.execute(
            `INSERT INTO BMCSDL_COMPANY.NHANVIEN
            (MSNV,TEN,NGAYSINH,EMAIL,LUONG,MSTHUE)
            VALUES(:eid, :name, :birthdate, :email, :salary, :taxNumber)`,
            [
              data.eid,
              data.name,
              data.birthdate,
              data.email,
              data.salary,
              data.taxNumber,
            ],
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
