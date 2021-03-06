import { Flex, Heading, Avatar, Text, Tr, Td } from '@chakra-ui/react'
import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/adventurer'
import { Employee } from '../../types/user'

interface Props {
  employee: Employee
  onOpen: () => void
  setSelectedEmployee: (emp: Employee) => void
}
const TableRow = ({ employee, onOpen, setSelectedEmployee }: Props) => {
  const svg = createAvatar(style, {
    seed: `${employee.eid}-${employee.name}`,
    dataUri: true,
  })
  const handleOpenModal = () => {
    setSelectedEmployee(employee)
    onOpen()
  }
  return (
    <Tr
      _hover={{
        background: 'white',
        color: 'teal.500',
        cursor: 'pointer',
      }}
      onClick={handleOpenModal}
    >
      <Td>{employee.department || '*******'}</Td>
      <Td isNumeric>{employee.eid}</Td>
      <Td>
        <Flex align="center">
          <Avatar size="md" mr={2} src={svg} />
          <Flex flexDir="column">
            <Heading size="sm">{employee.name || '******************'}</Heading>
            <Text fontSize="sm" color="gray">
              {employee.position || '********'}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td>{employee.email || '*********************'}</Td>
      <Td>{employee.birthdate || '************'}</Td>
      <Td isNumeric>
        <Text fontWeight="bold" display="inline-table">
          {employee.salary !== null
            ? Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(employee.salary)
            : '*******'}
        </Text>
      </Td>
      <Td>{employee.taxNumber}</Td>
    </Tr>
  )
}

export default TableRow
