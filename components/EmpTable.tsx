import React, { useState, useEffect } from 'react'
import { Flex, Heading, Table, Thead, Tbody, Tr, Th } from '@chakra-ui/react'
import { Employee } from '../types/user'
import { useGlobalContext } from '../context/GlobalContext'
import TableRow from './common/TableRow'

const EmpTable = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const { info } = useGlobalContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/employees', {
          method: 'POST',
          body: JSON.stringify(info),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        setEmployees(data as Employee[])
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <Flex justifyContent="space-between" mt={8}>
        <Flex align="flex-end">
          <Heading as="h2" size="lg" letterSpacing="tight">
            Nhân viên
          </Heading>
        </Flex>
      </Flex>
      <Flex overflow="auto">
        <Table variant="unstyled" mt={4}>
          <Thead>
            <Tr color="gray">
              <Th>Phòng ban</Th>
              <Th isNumeric>MSNV</Th>
              <Th>Tên</Th>
              <Th>Email</Th>
              <Th>Ngày sinh</Th>
              <Th isNumeric>Lương</Th>
              <Th> MS Thuế</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employees.map((employee) => (
              <TableRow key={`empRow-${employee.eid}`} employee={employee} />
            ))}
          </Tbody>
        </Table>
      </Flex>
    </>
  )
}

export default EmpTable
