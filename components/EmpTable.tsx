import React, { useState, useEffect } from 'react'
import {
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  useDisclosure,
  useToast,
  Button,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { Employee } from '../types/user'
import { useGlobalContext } from '../context/GlobalContext'
import TableRow from './common/TableRow'
import EmpInfoModal from './EmpInfoModal'
import { useRouter } from 'next/router'
import * as ROUTES from '../routes'
import AddEmpModal from './AddEmpModal'

const EmpTable = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const { info } = useGlobalContext()
  // vars to handle opening or closing employee detail modal
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [openAddModal, setOpenAddModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>()
  // state for reloading table
  const [loadTable, setLoadTable] = useState(true)
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchEmpData = await fetch('/api/employees', {
          method: 'POST',
          body: JSON.stringify({ info: info }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const response = await fetchEmpData
        if (response.status === 500) {
          response.json().then((json) => {
            const message = json.message
            toast({
              title: 'Failed to get data',
              description: `Redirecting to login! \n Detail: ${message}!`,
              status: 'error',
              duration: 9000,
              isClosable: true,
              position: 'top',
            })
            router.push(ROUTES.LOGIN)
          })
        } else if (response.status === 200) {
          response.json().then((json) => {
            setEmployees(json as Employee[])
          })
        }
      } catch (err) {
        console.error(err)
      }
    }
    if (loadTable) {
      fetchData()
      setLoadTable(false)
    }
  }, [loadTable])

  return (
    <>
      <Flex justifyContent="space-between" mt={8}>
        <Flex align="flex-end">
          <Heading as="h2" size="lg" letterSpacing="tight">
            Nhân viên
          </Heading>
        </Flex>
        <Button colorScheme="green" onClick={() => setOpenAddModal(true)}>
          <AddIcon mr={2} />
          {'Thêm nhân viên'}
        </Button>
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
              <TableRow
                key={`empRow-${employee.eid}`}
                employee={employee}
                onOpen={onOpen}
                setSelectedEmployee={setSelectedEmployee}
              />
            ))}
          </Tbody>
        </Table>
        <AddEmpModal
          isOpen={openAddModal}
          onClose={() => setOpenAddModal(false)}
          setLoadTable={setLoadTable}
        />
        <EmpInfoModal
          isOpen={isOpen}
          onClose={onClose}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          setLoadTable={setLoadTable}
        />
      </Flex>
    </>
  )
}

export default EmpTable
