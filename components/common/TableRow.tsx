import { Flex, Heading, Avatar, Text, Tr, Td } from '@chakra-ui/react'
import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/adventurer'
import { Employee } from '../../types/user'

interface Props {
  employee: Employee
}
const TableRow = ({ employee }: Props) => {
  const svg = createAvatar(style, {
    seed: `${employee.eid}-${employee.name}`,
    dataUri: true,
  })
  return (
    <Tr
      _hover={{
        background: 'white',
        color: 'teal.500',
        cursor: 'pointer',
      }}
    >
      <Td>{employee.department !== null ? employee.department : '*******'}</Td>
      <Td isNumeric>{employee.eid}</Td>
      <Td>
        <Flex align="center">
          <Avatar size="md" mr={2} src={svg} />
          <Flex flexDir="column">
            <Heading size="sm" textTransform="capitalize">
              {employee.name !== null
                ? employee.name.toLowerCase()
                : '******************'}
            </Heading>
            <Text fontSize="sm" color="gray" textTransform="capitalize">
              {employee.position.toLowerCase()}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td>
        {employee.email !== null ? employee.email : '*********************'}
      </Td>
      <Td>
        {employee.birthdate !== null ? employee.birthdate : '************'}
      </Td>
      <Td isNumeric>
        <Text fontWeight="bold" display="inline-table">
          {employee.salary !== null
            ? Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(employee.salary)
            : '**********'}
        </Text>
      </Td>
      <Td>{employee.taxNumber}</Td>
    </Tr>
  )
}

export default TableRow
