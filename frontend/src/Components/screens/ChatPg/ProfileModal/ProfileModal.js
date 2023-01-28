import { ViewIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  useToast,
  Input,
  Avatar,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FormControl, FormLabel } from '@chakra-ui/react';
import { Switch } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const ProfileModal = ({ user, children }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const userInfo=JSON.parse(localStorage.getItem('userInfo'));
  const [pic, setPic] = useState(userInfo.pic ? userInfo.pic : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
  const [picMessage, setPicMessage] = useState();
  const [email,setEmail]=useState(userInfo.email);


  const postDetails = (pics) => {
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "eventmanage");
      data.append("cloud_name", "dxxu4powb");
      // console.log(data);
      fetch("https://api.cloudinary.com/v1_1/dxxu4powb/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setPic(data.url.toString());

        })
        .catch((err) => {
          // console.log(err);
        });
    } else {
      return setPicMessage("Please Select an Image");
    }
  }
  const submitHandler = async () => {

    try {

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.put(
        "/api/users/profile", { email,pic }, config
      );

      // console.log(JSON.stringify(data));
      toast({
        title: "Update Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/chat");
    } catch (error) {
      console.log("error.response.data.message");
      console.log(error);
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

    }

  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>

          {children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {userInfo.name}


          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >

            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input type='email' value={userInfo.email} disabled />
            </FormControl>
            <FormControl >
              <Input
              onChange={(e) => postDetails(e.target.files[0])}
              id="custom-file"
              type="file"
              accept=".png, .jpg, .jpeg"
              label="Upload Profile Picture"
              custom />
              </FormControl>
            <Avatar size='2xl' name='Segun Adebayo' src={pic} />

            <FormControl
              onChange={(e) => postDetails(e.target.files[0])}
              id="custom-file"
              type="file"
              accept=".png, .jpg, .jpeg"
              label="Upload Profile Picture"
              custom
            />
            <br></br>
            <Button colorScheme='teal' onClick={submitHandler}>
              Update
            </Button>


          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal
