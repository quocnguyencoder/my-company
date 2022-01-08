import { Box, Spinner } from '@chakra-ui/react'
import React from 'react'

const Loading = () => {
  return (
    <Box
      pos="absolute"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      w="100%"
      h="100%"
      t="0"
      l="0"
      textAlign="center"
      opacity="0.7"
      bgColor="#fff"
      zIndex="999"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Box>
  )
}

export default Loading
