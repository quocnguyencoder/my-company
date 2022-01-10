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
  Select,
  useToast,
} from '@chakra-ui/react'
import { Department } from '../types/database'
import { useGlobalContext } from '../context/GlobalContext'
import React, { useState, useEffect } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  setLoadTable: (num: boolean) => void
}

interface NewEmp {
  eid: number
  name: string
  email: string
  birthdate: string
  salary: number
  taxNumber: string
  did: number
  position: string
}

const AddEmpModal = ({ isOpen, onClose, setLoadTable }: Props) => {
  const initEmpValue = {
    eid: -1,
    name: '',
    email: '',
    birthdate: '',
    salary: -1,
    taxNumber: '',
    did: 0,
    position: '',
  } as NewEmp
  const [departments, setDepartments] = useState<Department[]>([])
  const [empInfo, setEmpInfo] = useState<NewEmp>(initEmpValue)
  const { info } = useGlobalContext()
  const toast = useToast()

  const openToast = (
    title: string,
    description: string,
    status: 'error' | 'info' | 'warning' | 'success'
  ) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 6000,
      isClosable: true,
      position: 'top',
    })
  }

  // keep track of user input
  const handleChange = (
    event:
      | React.FormEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const name = event.currentTarget.name
    const value = event.currentTarget.value
    setEmpInfo((values) => ({ ...values, [name]: value }))
  }

  const handleCloseModal = () => {
    setEmpInfo(initEmpValue)
    onClose()
  }

  const hasUnsetField = () => {
    const allKeys = Object.keys(empInfo)
    return !allKeys.every((key) => empInfo[key] !== initEmpValue[key])
  }

  const handleAddNewEmp = () => {
    const insertNewEmp = async () => {
      try {
        const requestInsertNewEmp = await fetch(`/api/employees`, {
          method: 'PUT',
          body: JSON.stringify({
            info: info,
            data: empInfo,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const response = await requestInsertNewEmp
        response.json().then((json) => {
          const message = json.message
          if (response.status === 200) {
            openToast(
              'Insert successfully',
              `Nhân viên được thêm thành công!`,
              'success'
            )
            insertNewPosition()
          } else {
            openToast('Insert Failed!', `Detail: ${message}!`, 'error')
          }
        })
      } catch (err) {
        console.error(err)
      }
    }
    const insertNewPosition = async () => {
      try {
        const requestInsertNewPosition = await fetch(`/api/position`, {
          method: 'POST',
          body: JSON.stringify({
            info: info,
            data: {
              eid: empInfo.eid,
              position: empInfo.position,
              did: empInfo.did,
            },
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const response = await requestInsertNewPosition
        response.json().then((json) => {
          const message = json.message
          if (response.status === 200) {
            openToast(
              'Insert successfully',
              `Nhân viên thêm vào phòng ban thành công!`,
              'success'
            )
            setLoadTable(true)
            handleCloseModal()
          } else {
            openToast('Insert Failed!', `Detail: ${message}!`, 'error')
          }
        })
      } catch (err) {
        console.error(err)
      }
    }
    if (hasUnsetField()) {
      openToast(
        'Thông tin không hợp lệ',
        'Không được để trống thông tin',
        'error'
      )
    } else {
      insertNewEmp()
    }
  }

  // fetch department names when open modal
  useEffect(() => {
    if (isOpen) {
      const fetchDepartmentData = async () => {
        try {
          const getDepData = await fetch(`/api/departments`, {
            method: 'POST',
            body: JSON.stringify({ info: info }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const response = await getDepData
          if (response.status === 200) {
            response.json().then((json) => {
              const depList = json as Department[]
              //console.log(depList)
              setDepartments(depList)
            })
          } else {
            response.json().then((json) => {
              const message = json.message
              openToast('Failed to get data', `Detail: ${message}!`, 'error')
              onClose()
            })
          }
        } catch (err) {
          console.error(err)
        }
      }
      fetchDepartmentData()
    }
  }, [isOpen])

  return (
    <>
      <Modal size={'lg'} isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm nhân viên</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>MSNV</FormLabel>
              <Input
                type="number"
                value={empInfo.eid === -1 ? '' : empInfo.eid}
                name={'eid'}
                onChange={handleChange}
                placeholder="Mã số nhân viên"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Họ và tên</FormLabel>
              <Input
                value={empInfo.name}
                placeholder="vd: Nguyen Van A"
                name={'name'}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={empInfo.email}
                placeholder="vd: abc@gmail.com"
                name={'email'}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Ngày sinh</FormLabel>
              <Input
                type="date"
                value={empInfo.birthdate}
                name={'birthdate'}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Phòng ban</FormLabel>
              <Select
                placeholder="Chọn phòng ban"
                value={empInfo.did}
                name={'did'}
                onChange={handleChange}
              >
                {departments
                  .filter((dep) => dep.dname !== null)
                  .map((dep) => (
                    <option key={`dep-select-${dep.did}`} value={dep.did}>
                      {dep.dname}
                    </option>
                  ))}
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Chức vụ</FormLabel>
              <Select
                placeholder="Chọn chức vụ"
                value={empInfo.position}
                name={'position'}
                onChange={handleChange}
              >
                <option value="NHAN VIEN">{'Nhân viên'}</option>
                <option value="QUAN LY">{'Quản lý'}</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Lương</FormLabel>
              <Input
                type="number"
                value={empInfo.salary === -1 ? '' : empInfo.salary}
                name={'salary'}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Mã số thuế</FormLabel>
              <Input
                value={empInfo.taxNumber}
                name={'taxNumber'}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleAddNewEmp} colorScheme="green" mr={3}>
              Lưu thay đổi
            </Button>
            <Button variant="ghost" onClick={handleCloseModal}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddEmpModal
