import {
  IconButton,
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
} from '@chakra-ui/react'
import { FiMenu, FiChevronDown } from 'react-icons/fi'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useGlobalContext } from '../../context/GlobalContext'
import { useRouter } from 'next/router'
import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/adventurer'
import { Employee } from '../../types/user'

interface MobileProps extends FlexProps {
  currEmp: Employee
  onOpen: () => void
}
const MobileNav = ({ currEmp, onOpen, ...rest }: MobileProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { setInfo } = useGlobalContext()
  const router = useRouter()

  const handleLogout = () => {
    setInfo(undefined)
    router.push('/login')
  }
  //console.log(currEmp)
  return currEmp !== undefined ? (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        MyCompany
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Button onClick={toggleColorMode}>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              key={'menu-button-sidebar-1'}
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar
                  size={'sm'}
                  src={createAvatar(style, {
                    seed: `${currEmp.eid}-${currEmp.name}`,
                    dataUri: true,
                  })}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm" textTransform="capitalize">
                    {currEmp.name.toLowerCase()}
                  </Text>
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    textTransform="capitalize"
                  >
                    {currEmp.position.toLowerCase()}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  ) : (
    <></>
  )
}

export default MobileNav
