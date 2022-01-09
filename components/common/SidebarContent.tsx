import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  BoxProps,
} from '@chakra-ui/react'
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import NavItem from './NavItem'

interface LinkItemProps {
  name: string
  tabName: string
  icon: IconType
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Nhân viên', tabName: 'empTable', icon: FiHome },
  { name: 'Quản lý hoạt động', tabName: 'auditTable', icon: FiTrendingUp },
  { name: 'Khám phá', tabName: 'explore', icon: FiCompass },
  { name: 'Lưu trữ', tabName: 'favorites', icon: FiStar },
  { name: 'Cài đặt', tabName: 'settings', icon: FiSettings },
]

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          MyCompany
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} tabName={link.tabName}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

export default SidebarContent
