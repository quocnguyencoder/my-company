import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Image,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useGlobalContext } from '../context/GlobalContext'
import { useRouter } from 'next/router'
import { ConnectInfo } from '../types/user'

export default function SplitScreen() {
  const [ip, setIP] = useState('')
  const [svName, setSvName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { info, setInfo } = useGlobalContext()
  const router = useRouter()

  const saveLoginInfo = () => {
    localStorage.setItem('ip', ip)
    localStorage.setItem('svName', svName)
    localStorage.setItem('username', username)
    localStorage.setItem('password', password)
  }

  const handleLogin = async () => {
    const info = {
      ip: ip,
      svName: svName,
      username: username,
      password: password,
      eid: null,
    }
    const fetchData = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(info),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const response = await fetchData
    //console.log(response)
    if (response.status === 200) {
      response.json().then((json) => {
        info.eid = json.eid
        //console.log(info)
        saveLoginInfo()
        setInfo(info as ConnectInfo)
        router.push('/')
      })
    } else {
      alert('sth went wrong')
    }
  }

  useEffect(() => {
    //console.log(info)
    if (info !== undefined) {
      router.push('/')
    } else {
      setIP(localStorage.getItem('ip') || '')
      setSvName(localStorage.getItem('svName') || '')
      setUsername(localStorage.getItem('username') || '')
      setPassword(localStorage.getItem('password') || '')
    }
  }, [])

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'}>
          <Heading fontSize={'2xl'}>Sign in to your account</Heading>
          <FormControl id="host-ip">
            <FormLabel>Host ip</FormLabel>
            <Input value={ip} onChange={(e) => setIP(e.target.value)} />
          </FormControl>
          <FormControl id="service-name">
            <FormLabel>Service name</FormLabel>
            <Input value={svName} onChange={(e) => setSvName(e.target.value)} />
          </FormControl>
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Stack spacing={6}>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'start'}
              justify={'space-between'}
            >
              <Checkbox defaultIsChecked>Remember me</Checkbox>
              <Link color={'blue.500'}>Forgot password?</Link>
            </Stack>
            <Button
              onClick={handleLogin}
              colorScheme={'blue'}
              variant={'solid'}
            >
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          src={
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
          }
        />
      </Flex>
    </Stack>
  )
}
