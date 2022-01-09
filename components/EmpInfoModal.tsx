import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { Employee } from '../types/user'

interface Props {
  isOpen: boolean
  onClose: () => void
  selectedEmployee: Employee
  setLoadTable: (num: number) => void
}

const EmpInfoModal = ({
  isOpen,
  onClose,
  selectedEmployee,
  setLoadTable,
}: Props) => {
  const [empInfo, setEmpInfo] = useState<Employee>(selectedEmployee)
  const [isEditable, setEditable] = useState(false)
  useEffect(() => {
    setEmpInfo(selectedEmployee)
  }, [selectedEmployee])

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const name = event.currentTarget.name
    const value = event.currentTarget.value
    setEmpInfo((values) => ({ ...values, [name]: value }))
  }

  const handleCloseModal = () => {
    setEditable(false)
    onClose()
  }

  const handleUpdateEmpInfo = () => {
    handleCloseModal()
    setLoadTable(1)
  }

  return empInfo !== undefined ? (
    <>
      <Modal size={'lg'} isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thông tin nhân viên</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button onClick={() => setEditable(true)} colorScheme="blue" mr={3}>
              Cập nhật
            </Button>
            <Button colorScheme="red">Xóa</Button>
          </ModalFooter>
          <ModalBody>
            <FormControl isDisabled>
              <FormLabel>MSNV</FormLabel>
              <Input value={empInfo.eid} placeholder="Mã số nhân viên" />
            </FormControl>

            <FormControl mt={4} isDisabled={!isEditable}>
              <FormLabel>Họ và tên</FormLabel>
              <Input
                value={empInfo.name || '*************'}
                placeholder="vd: Nguyen Van A"
                name={'name'}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isDisabled={!isEditable}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={empInfo.email || '***************'}
                placeholder="vd: abc@gmail.com"
                name={'email'}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isDisabled={!isEditable}>
              <FormLabel>Ngày sinh</FormLabel>
              <Input
                type="date"
                value={empInfo.birthdate}
                name={'birthdate'}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isDisabled={!isEditable}>
              <FormLabel>Phòng ban</FormLabel>
              <Input
                value={empInfo.department || '*********'}
                name={'department'}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isDisabled={!isEditable}>
              <FormLabel>Lương</FormLabel>
              <Input
                type="number"
                value={empInfo.salary || '00000000'}
                name={'salary'}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isDisabled={!isEditable}>
              <FormLabel>Mã số thuế</FormLabel>
              <Input
                value={empInfo.taxNumber}
                name={'taxNumber'}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!isEditable}
              onClick={handleUpdateEmpInfo}
              colorScheme="green"
              mr={3}
            >
              Lưu thay đổi
            </Button>
            <Button variant="ghost" onClick={handleCloseModal}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  ) : (
    <></>
  )
}

export default React.memo(EmpInfoModal)
