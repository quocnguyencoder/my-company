import React from 'react'
import {
  Flex,
  Heading,
  Avatar,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react'
import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/adventurer'

const EmpTable = () => {
  const svg = createAvatar(style, {
    seed: '2-Quoc',
    dataUri: true,
  })
  return (
    <>
      <Flex justifyContent="space-between" mt={8}>
        <Flex align="flex-end">
          <Heading as="h2" size="lg" letterSpacing="tight">
            Phòng tài chính
          </Heading>
        </Flex>
      </Flex>
      <Flex overflow="auto">
        <Table variant="unstyled" mt={4}>
          <Thead>
            <Tr color="gray">
              <Th isNumeric>MSNV</Th>
              <Th>Tên</Th>
              <Th>Email</Th>
              <Th isNumeric>SĐT</Th>
              <Th>Ngày sinh</Th>
              <Th isNumeric>Lương</Th>
              <Th> MS Thuế</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr
              _hover={{
                background: 'white',
                color: 'teal.500',
                cursor: 'pointer',
              }}
            >
              <Td isNumeric>2</Td>
              <Td>
                <Flex align="center">
                  <Avatar size="md" mr={2} src={svg} />
                  <Flex flexDir="column">
                    <Heading size="sm" letterSpacing="tight">
                      Quoc
                    </Heading>
                    <Text fontSize="sm" color="gray">
                      Quản lý
                    </Text>
                  </Flex>
                </Flex>
              </Td>
              <Td>test@gmail.com</Td>
              <Td>01123123</Td>
              <Td>01/11/2000</Td>
              <Td isNumeric>
                <Text fontWeight="bold" display="inline-table">
                  {Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(1000000)}
                </Text>
              </Td>
              <Td>01123123</Td>
            </Tr>
          </Tbody>
        </Table>
      </Flex>
    </>
  )
}

export default EmpTable
