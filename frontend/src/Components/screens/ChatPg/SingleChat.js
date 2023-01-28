import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
// import "./styles.css";
import { Avatar, Button, IconButton, Spinner, useMediaQuery, useToast } from "@chakra-ui/react";
import { checkingBlockContent, getSender, getSenderFull } from "../../../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon, ArrowRightIcon, LinkIcon } from "@chakra-ui/icons";
import ProfileModal from "../ChatPg/ProfileModal/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../Assets_Img/typing_animation.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "../ChatPg/UpdateGroupChatModal";
import PreviewImgScreen from "./PreviewImgScreen";
import { ChatState } from "../../Context/ChatProvider";
import { FormLabel } from '@chakra-ui/react';
import { Switch } from '@chakra-ui/react'
import './SingleChat.css';
import { createWorker } from 'tesseract.js';
const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [pic, setPic] = useState();
  const [picMessage, setPicMessage] = useState();
  const [previewImg, setpreviewImg] = useState(false);
  const toast = useToast();

  const worker = createWorker({
    logger: m => <></>
  });
  const doOCR = async (pic) => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(pic);
    console.log("text");
    console.log(text);
    return text;

  };

  const closePreview = () => {
    setpreviewImg(false);
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      // toast({
      //   title: "Error Occured!",
      //   description: "Failed to Load the Messages",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom",
      // });
    }
  };

  const sendMessage = async (event) => {
    if (newMessage || previewImg) {
      socket.emit("stop typing", selectedChat._id);
      if (previewImg && pic) {
        try {
          console.log("1");
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          console.log("2");
          const ocr = await doOCR(pic);
          console.log("3");
          setNewMessage("");
          const { data } = await axios.post(
            "/api/message",
            {
              isImg: true,
              ImgContent: pic,
              ImgOCRContent: ocr,
              content: newMessage ? newMessage : "",
              chatId: selectedChat,
            },
            config
          );

          socket.emit("new message", data);
          setpreviewImg(false);
          setMessages([...messages, data]);
        } catch (error) {
          console.log(error);
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
      else {

        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          setNewMessage("");
          const { data } = await axios.post(
            "/api/message",
            {
              isImg: false,
              ImgContent: "",
              content: newMessage,
              chatId: selectedChat,
            },
            config
          );
          socket.emit("new message", data);
          setMessages([...messages, data]);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
    }
  };
  const postPic = (pics) => {
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "eventmanage");
      data.append("cloud_name", "dxxu4powb");

      fetch("https://api.cloudinary.com/v1_1/dxxu4powb/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {

          setpreviewImg(true);

          setPic(data.url.toString());

        })
        .catch((err) => {
          // console.log(err);
        });
    } else {
      return setPicMessage("Please Select an Image");
    }
  }
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    // this means if we receive any msg
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // if notification does not includes already received msg
        if (!notification.includes(newMessageRecieved)) {
          // give notification
          if (newMessageRecieved.isImg && !checkingBlockContent(JSON.parse(localStorage.getItem("userInfo")).blockWords, newMessageRecieved.ImgOCRContent)) {

            setNotification([newMessageRecieved, ...notification]);
            setFetchAgain(!fetchAgain);
          }
          if (!newMessageRecieved.isImg) {
            console.log(newMessageRecieved);
            setNotification([newMessageRecieved, ...notification]);
            setFetchAgain(!fetchAgain);
          }

        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 50000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>

      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "15px", md: "24px" }}
            pb={3}
            px={10}
            w="100%"
            fontFamily={"'Fredoka', sans-serif "}
            display="flex"
            justifyContent={selectedChat.isGroupChat ? "space-between" : ""}
            alignItems="center"
            color='#000000'
            bg="#8edcd8"
            borderBottomRightRadius="20"
            borderBottomLeftRadius="20"
          >


            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <IconButton

                    icon={<ArrowBackIcon />}
                    color='#dc8e92'
                    onClick={() => setSelectedChat("")}
                    mr={4}
                    mt={1}

                  />
                  <Avatar
                    size="md"
                    mr={10}
                    mt={1}
                    cursor="pointer"
                    src={getSenderFull(user, selectedChat.users).pic}
                  />
                  <>
                    {selectedChat && selectedChat.users[0].name.toUpperCase() === user.name.toUpperCase() ?
                      <>
                        {selectedChat.users[1].name}
                      </> :
                      <>
                        {selectedChat.users[0].name}
                      </>
                    }

                  </>

                  {/* <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  /> */}

                </>
              ) : (
                <>
                  <IconButton

                    icon={<ArrowBackIcon />}
                    color='#dc8e92'
                    onClick={() => setSelectedChat("")}
                    mr={4}
                    mt={1}

                  />
                  {selectedChat.chatName}
                  <UpdateGroupChatModal
                    // color='#ffffff'
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    mt={1}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            w="100%"
            h="90%"
            borderRadius="lg"
            overflowY="hidden"

          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <>
                {previewImg ?
                  (

                    <PreviewImgScreen pic={pic} previewImg={previewImg} closePreview={closePreview} />

                  ) :
                  (
                    <Box

                      display="flex"
                      flexDirection="column"
                      overflowY="auto"
                      scrollbarWidth="none"
                      padding="10"
                      css={{
                        '&::-webkit-scrollbar': {
                          width: '9px',

                        },
                        '&::-webkit-scrollbar-track': {
                          background: "#000000",

                        },
                        '&::-webkit-scrollbar-thumb': {
                          height: "1px",
                          background: "#38B2AC",
                          borderRadius: "40px"
                        },
                      }}
                    >
                      <ScrollableChat messages={messages} />
                    </Box>
                  )
                }

              </>
            )
            }
            {istyping ? (
              <div>
                <Lottie
                  options={defaultOptions}
                  height={50}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div>
            ) : (
              <></>
            )}
            <Box display="flex" alignContent="center" justifyContent="center" h={"5vh"} >
              <FormControl
                id="image"
                w={"5%"}
              >
                <label htmlFor="fileInput">
                  <LinkIcon bgColor='#C8E1C1' w={"100%"} h={"100%"} p={2} borderRadius="5" cursor="pointer" visibility={previewImg ? "hidden" : "visible"} />
                </label>
                <input
                  type='file'
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={(e) => postPic(e.target.files[0])}

                />

              </FormControl>
              <FormControl
                w={"96%"}
                h={"100%"}

              >
                <Input
                  placeholder=" Enter a message..  "
                  value={newMessage}
                  w={"90%"}
                  h={"100%"}
                  onChange={typingHandler}
                  bgColor="#ffffff"
                />

                <Button h={"100%"} w={"5%"} p={0} mt={0} borderRadius="5" backgroundColor={"#ffffff"} onClick={sendMessage} >
                  <IconButton
                    w={"100%"}
                    h={"100%"}
                    bgColor='#C8E1C1'
                    icon={<ArrowRightIcon />}
                  />
                </Button>
              </FormControl>
            </Box>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )
      }
    </>
  );
};

export default SingleChat;