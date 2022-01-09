import { Tr, Td } from '@chakra-ui/react'
import { AuditTrail } from '../../types/database'
import moment from 'moment'

interface Props {
  auditTrail: AuditTrail
}
const TableRow = ({ auditTrail }: Props) => {
  return (
    <Tr
      _hover={{
        background: 'white',
        color: 'teal.500',
        cursor: 'pointer',
      }}
    >
      <Td>{moment(auditTrail.timestamp).format('LLL')}</Td>
      <Td>{auditTrail.dbUser}</Td>
      <Td>{auditTrail.objectName}</Td>
      <Td>{auditTrail.sqlQuery}</Td>
      <Td>{auditTrail.statementType}</Td>
    </Tr>
  )
}

export default TableRow
