import { Flex, Icon, Link, FlexProps, useToast } from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { ReactText } from 'react'
import { useGlobalContext } from '../../context/GlobalContext'

interface NavItemProps extends FlexProps {
  icon: IconType
  tabName: string
  children: ReactText
}
const NavItem = ({ icon, tabName, children, ...rest }: NavItemProps) => {
  const { currEmp, currTab, setCurrTab } = useGlobalContext()
  const toast = useToast()

  const handleNavigate = () => {
    if (tabName === 'auditTable') {
      if (currEmp.department === 'HR' && currEmp.position === 'QUAN LY') {
        setCurrTab(tabName)
      } else {
        toast({
          title: 'Unauthorized access',
          description: `This is only for HR manager`,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top',
        })
      }
    } else {
      setCurrTab(tabName)
    }
  }

  return (
    <Link href="#" style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={currTab === tabName ? 'teal.500' : 'transparent'}
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        onClick={handleNavigate}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  )
}

export default NavItem
