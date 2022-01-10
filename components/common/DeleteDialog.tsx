import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import React, { useRef } from 'react'

interface Props {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  handleDeleteEmp: () => void
}

export default function DeleteDialog({
  isOpen,
  setIsOpen,
  handleDeleteEmp,
}: Props) {
  const onClose = () => {
    setIsOpen(false)
    handleDeleteEmp()
  }
  const cancelRef = useRef()

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {'Xóa nhân viên'}
            </AlertDialogHeader>

            <AlertDialogBody>
              {`Bạn có chắc chắn muốn xóa nhân viên này không? Hành động này không thể hoàn tác!`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Hủy
              </Button>
              <Button colorScheme="red" onClick={onClose} ml={3}>
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
