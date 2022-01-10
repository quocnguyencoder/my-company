import { useToast } from '@chakra-ui/react'

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
    duration: 9000,
    isClosable: true,
    position: 'top',
  })
}

export default openToast
