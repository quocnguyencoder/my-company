import React, { useState, useEffect } from 'react'
import { Flex, Heading, Table, Thead, Tbody, Tr, Th } from '@chakra-ui/react'
import { AuditTrail } from '../../types/database'
import { useGlobalContext } from '../../context/GlobalContext'
import AuditRow from './AuditRow'

const AuditTable = () => {
  const [auditTrails, setAuditTrails] = useState<AuditTrail[]>([])
  const { info } = useGlobalContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/audit', {
          method: 'POST',
          body: JSON.stringify(info),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        setAuditTrails(data as AuditTrail[])
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
            Lịch sử chỉnh sửa
          </Heading>
        </Flex>
      </Flex>
      <Flex overflow="auto">
        <Table variant="unstyled" mt={4}>
          <Thead>
            <Tr color="gray">
              <Th>Timestamp</Th>
              <Th isNumeric>Username</Th>
              <Th>Table</Th>
              <Th>Query</Th>
              <Th>Type</Th>
            </Tr>
          </Thead>
          <Tbody>
            {auditTrails.map((audit, index) => (
              <AuditRow key={`auditRow-${index}`} auditTrail={audit} />
            ))}
          </Tbody>
        </Table>
      </Flex>
    </>
  )
}

export default AuditTable
