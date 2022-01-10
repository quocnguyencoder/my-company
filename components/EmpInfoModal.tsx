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
import React, { useState, useEffect } from 'react'
import DeleteDialog from './common/DeleteDialog'
import { Employee } from '../types/user'
import { Department } from '../types/database'
import { useGlobalContext } from '../context/GlobalContext'

interface Props {
  isOpen: boolean
  onClose: () => void
  selectedEmployee: Employee
  setSelectedEmployee: (employee: Employee) => void
  setLoadTable: (num: boolean) => void
}

const EmpInfoModal = ({
  isOpen,
  onClose,
  selectedEmployee,
  setSelectedEmployee,
  setLoadTable,
}: Props) => {
  const [empInfo, setEmpInfo] = useState<Employee>(selectedEmployee)
  const [isEditable, setEditable] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedDep, setSelectedDep] = useState(0)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
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

  // fetch department names when open modal
  useEffect(() => {
    if (isOpen) {
      setEmpInfo(selectedEmployee)
      setSelectedDep(depNameToID(selectedEmployee.department))
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
              handleCloseModal()
            })
          }
        } catch (err) {
          console.error(err)
        }
      }
      fetchDepartmentData()
    }
  }, [isOpen])

  const depNameToID = (dname: string) => {
    const resDep = departments.filter((dep) => dep.dname === dname)
    return resDep.length === 0 ? -1 : resDep[0].did
  }

  const didToDepName = (did: number) => {
    const resDep = departments.filter((dep) => dep.did == did)
    return resDep.length === 0 ? '' : resDep[0].dname
  }

  // keep track of user input
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const name = event.currentTarget.name
    const value = event.currentTarget.value
    setEmpInfo((values) => ({ ...values, [name]: value }))
  }

  // turn disable form and reset selected emp
  // when closing modal
  const handleCloseModal = () => {
    setEditable(false)
    setSelectedEmployee(undefined)
    onClose()
  }

  // check if employee info has empty field
  const hasEmptyField = () => {
    return !Object.values(empInfo)
      .filter((value) => typeof value !== 'number')
      .every((emp) => emp !== '')
  }

  // check if any info is updated
  const hasUpdatedInfo = () => {
    const cpOriginalEmp = { ...selectedEmployee } as Employee
    return !(JSON.stringify(cpOriginalEmp) === JSON.stringify(empInfo))
  }

  // check if department info updated
  const hasUpdatedDep = () =>
    selectedDep !== depNameToID(empInfo.department) && selectedDep !== 0

  const handleUpdateEmpInfo = () => {
    const updateEmpData = async () => {
      try {
        const requestUpdateEmp = await fetch(`/api/employees/${empInfo.eid}`, {
          method: 'PUT',
          body: JSON.stringify({
            info: info,
            data: empInfo,
            did: selectedDep,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const response = await requestUpdateEmp
        response.json().then((json) => {
          const message = json.message
          if (response.status === 200) {
            openToast(
              'Update successfully',
              `Cập nhật thông tin thành công!`,
              'success'
            )
            setLoadTable(true)
            setEditable(false)
          } else {
            openToast('Update Failed!', `Detail: ${message}!`, 'error')
          }
        })
      } catch (err) {
        console.error(err)
      }
    }
    const updateEmpDep = async () => {
      try {
        const requestUpdateEmp = await fetch(`/api/position/${empInfo.eid}`, {
          method: 'PUT',
          body: JSON.stringify({
            info: info,
            did: selectedDep,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const response = await requestUpdateEmp
        response.json().then((json) => {
          const message = json.message
          if (response.status === 200) {
            openToast(
              'Position update successfully',
              `Chuyển phòng ban thành công`,
              'success'
            )
            setEmpInfo({
              ...empInfo,
              ['department']: didToDepName(selectedDep),
            })
            setSelectedEmployee({
              ...empInfo,
              ['department']: didToDepName(selectedDep),
            })
            setLoadTable(true)
            setEditable(false)
          } else {
            openToast(
              'Department Update Failed!',
              `Detail: ${message}!`,
              'error'
            )
          }
        })
      } catch (err) {
        console.error(err)
      }
    }
    if (hasEmptyField() || selectedDep === 0) {
      openToast(
        'Thông tin không hợp lệ',
        'Không được để trống thông tin',
        'error'
      )
    } else if (hasUpdatedInfo() && hasUpdatedDep()) {
      updateEmpDep()
      updateEmpData()
    } else if (hasUpdatedInfo()) {
      updateEmpData()
    } else if (hasUpdatedDep()) {
      updateEmpDep()
    } else {
      openToast(
        'Thông tin chưa được thay đổi',
        'Không có thông tin được thay đổi',
        'error'
      )
    }
  }

  const handleDeleteEmp = () => {
    const deleteEmpData = async () => {
      try {
        const requestDeleteEmp = await fetch(`/api/employees/${empInfo.eid}`, {
          method: 'DELETE',
          body: JSON.stringify({ info: info }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const response = await requestDeleteEmp

        response.json().then((json) => {
          const message = json.message
          if (response.status === 200) {
            openToast(
              'Delete successfully',
              `Xóa nhân viên thành công!`,
              'success'
            )
            setLoadTable(true)
            handleCloseModal()
          } else {
            openToast('Delete failed', `Detail: ${message}!`, 'error')
          }
        })
      } catch (err) {
        console.error(err)
      }
    }
    deleteEmpData()
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
            <Button onClick={() => setOpenDeleteDialog(true)} colorScheme="red">
              Xóa
            </Button>
          </ModalFooter>
          <ModalBody>
            <FormControl isDisabled>
              <FormLabel>MSNV</FormLabel>
              <Input value={empInfo.eid} placeholder="Mã số nhân viên" />
            </FormControl>

            <FormControl mt={4} isDisabled={!isEditable}>
              <FormLabel>Họ và tên</FormLabel>
              <Input
                value={empInfo.name || ''}
                placeholder="vd: Nguyen Van A"
                name={'name'}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isDisabled={!isEditable}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={empInfo.email || ''}
                placeholder="vd: abc@gmail.com"
                name={'email'}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isDisabled={!isEditable}>
              <FormLabel>Ngày sinh</FormLabel>
              <Input
                type="date"
                value={empInfo.birthdate || ''}
                name={'birthdate'}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isDisabled={!isEditable}>
              <FormLabel>Phòng ban</FormLabel>
              <Select
                placeholder="Chọn phòng ban"
                value={selectedDep}
                name={'department'}
                onChange={(e) => setSelectedDep(Number(e.target.value))}
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

            <FormControl mt={4} isDisabled={!isEditable}>
              <FormLabel>Lương</FormLabel>
              <Input
                type="number"
                value={empInfo.salary || ''}
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
      <DeleteDialog
        isOpen={openDeleteDialog}
        setIsOpen={setOpenDeleteDialog}
        handleDeleteEmp={handleDeleteEmp}
      />
    </>
  ) : (
    <></>
  )
}

export default React.memo(EmpInfoModal)
