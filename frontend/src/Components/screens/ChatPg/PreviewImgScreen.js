import React from 'react'
import { Box, Text } from "@chakra-ui/layout";
import { Button, Image } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons';

const PreviewImgScreen = ({ pic, previewImg, closePreview }) => {
 
  return (
    <>
      <Button w="80%" ml="auto" mr="auto" backgroundColor="#000000" onClick={closePreview}>
        <CloseIcon color="#ffffff"></CloseIcon>
      </Button>

      <Box ml="auto" mr="auto" mb={14} w="80%" h="80%" bg="#f0f8ff" display="flex" alignItems="center" justifyContent="center">

        <Image
          p={4}
          objectFit='contain'
          src={pic}
          h="100%"
          w="100%"
        />
      </Box>

    </>
  )
}

export default PreviewImgScreen
