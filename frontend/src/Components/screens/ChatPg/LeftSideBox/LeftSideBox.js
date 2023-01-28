import React from 'react'
import { AddIcon, AttachmentIcon, BellIcon, Icon, SearchIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { checkingBlockContent, getSender } from "../../../../config/ChatLogics";
import { Button, Input, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { ChatState } from "../../../Context/ChatProvider";
import GrpChatModal from "../../GrpChatModal/GrpChatModal";
import ChatLoading from '../../../Loading/ChatLoading';
import SearchListItem from '../SearchListItem/SearchListItem';
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import './LeftSideBox.css'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
const LeftSideBox = () => {
    const [loggedUser, setLoggedUser] = useState(JSON.parse(localStorage.getItem("userInfo")));

    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef();
    const toast = useToast();
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [lastUnblockedMsg, setLastUnblockedMsg] = useState();
    const { notification, setNotification } = ChatState();
    const [isLargerThan1000] = useMediaQuery('(min-width: 1000px)')
    const handleSearch = async () => {

        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/users/getUser?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };


    const accessChat = async (userId) => {


        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);

            console.log("selectedChat");
            console.log(selectedChat);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };


    const fetchChats = async () => {
        // console.log(user._id);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("/api/chat", config);
            setChats(data);
            // console.log(data);
        } catch (error) {

        }
    };

    useEffect(() => {
        fetchChats();
    });

    return (

        <Box
            display={isLargerThan1000 ? 'flex' : (selectedChat ? "none" : "flex" )}
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            p={1}
            bg="#181C34"
            w={isLargerThan1000 ? "40%":  "100%" }
            borderRadius="lg"
            borderWidth="1px"

        >
            <Box
                pb={3}
                px={2}
                bg="#181C34"
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"

            >
                <Button variant="ghost"    w="85%" ml={4} bg={"#dce5f8"} onClick={onOpen} >
                    <Text fontSize="lg" pl={"2px"}  fontFamily={"'Fredoka', sans-serif "}>
                        Search
                    </Text>
                    <Icon as={SearchIcon} ml={"80%"} />
                </Button>


                {/* Search Side Drawer */}
                <Drawer
                    isOpen={isOpen}
                    placement='left'
                    onClose={onClose}
                    finalFocusRef={btnRef}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Search Users </DrawerHeader>
                        <DrawerBody>
                            <Box pb={2} >
                                <Input placeholder='Search User here...'
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Button colorScheme='blue' onClick={handleSearch} w='140px' ml="50%" mt={3} p={1}>Search </Button>
                            </Box>

                            {/* if loading then component chatloading which is skeleton chakra */}
                            {loading ? (<ChatLoading />
                            ) : (
                                searchResult?.map((res) => (
                                    <SearchListItem
                                        key={res._id}
                                        user={res}
                                        handleFunction={() => accessChat(res._id)}
                                    />
                                ))
                            )}
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>

                {/* Add group chat button on left side  */}
                {/* on clicking Modal would be open  */}
                <GrpChatModal>
                    {/* between this is children so it is taking button as children */}
                    <Button
                        pl={2}
                        fontSize={"20px"}
                        rightIcon={<AddIcon />}
                    >
                    </Button>
                </GrpChatModal>
            </Box>

            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
                backgroundColor='#181C34'
            >
                <Text fontSize='lg' fontWeight="bold" color='#ffffff' >Your Messages</Text>
                <br></br>
                {chats ? (
                    <Stack overflowY="auto" padding={2}
                        css={{
                            '&::-webkit-scrollbar': {
                                width: '6px',


                            },
                            '&::-webkit-scrollbar-track': {
                                background: "#000000",

                            },
                            '&::-webkit-scrollbar-thumb': {
                                height: "1px",
                                background: "#ffffff",
                                borderRadius: "40px"
                            },
                        }}
                    >
                        {chats.map((chat) => (
                            <Box
                                onClick={() => {
                                    console.log(chat);
                                    console.log(notification);
                                    setNotification(notification.filter((n) => n.chat._id !== chat._id));
                                    setSelectedChat(chat)
                                }}
                                cursor="pointer"
                                bg={selectedChat && selectedChat._id === chat._id ? "#38B2AC" : "#2e2c42"}
                                px={3}
                                py={4}
                                borderRadius="lg"
                                key={chat._id}
                                display="flex"
                            >

                                <Avatar id="av" size='lg' src={ chat.users[0]._id === user._id ? chat.users[1].pic : chat.users[0].pic} />
                                <Box display="flex" flexDirection="column" pl="4">
                                    <Text id="person" fontSize='2xl' color='#ffffff' fontWeight="bold">
                                        {!chat.isGroupChat
                                            ? getSender(loggedUser, chat.users)
                                            : chat.chatName}
                                    </Text>

                                    {chat.latestMessage && !chat.latestMessage.isImg && (
                                        <>
                                            {/* {chat.latestMessage!== lastUnblockedMsg && <>{setLastUnblockedMsg(chat.latestMessage)}</>} */}
                                            <Text fontSize='md' color='#ffffff'>
                                                <b>{chat.latestMessage.sender.name === user.name ? "You" : chat.latestMessage.sender.name} : </b>
                                                {chat.latestMessage.content.length > 50 && !chat.latestMessage.isImg
                                                    ? chat.latestMessage.content.substring(0, 40) + "..."
                                                    : chat.latestMessage.content
                                                }

                                            </Text>
                                        </>
                                    )}
                                    {chat.latestMessage && chat.latestMessage.isImg && JSON.parse(localStorage.getItem("userInfo")).blockWords && !checkingBlockContent(JSON.parse(localStorage.getItem("userInfo")).blockWords, chat.latestMessage.ImgOCRContent) &&
                                        <>
                                            {/* {chat.latestMessage!== lastUnblockedMsg && <>{setLastUnblockedMsg(chat.latestMessage)}</>} */}
                                            <Text fontSize='md' color='#ffffff'>
                                                <b>
                                                    {chat.latestMessage.sender.name === user.name ? "You" : chat.latestMessage.sender.name} :
                                                </b>
                                                <b>Image <AttachmentIcon /></b>
                                            </Text>
                                        </>
                                    }
                                    {chat.latestMessage && chat.latestMessage.isImg && JSON.parse(localStorage.getItem("userInfo")).blockWords &&  checkingBlockContent(JSON.parse(localStorage.getItem("userInfo")).blockWords, chat.latestMessage.ImgOCRContent) &&
                                        (
                                            <Text fontSize='md' color='#ffffff' >
                                                <b>
                                                    {chat.latestMessage.sender.name === user.name ? "You" : chat.latestMessage.sender.name} :
                                                </b>
                                                <b>{chat.latestMessage.sender.name === user.name ? <> <b>Image <AttachmentIcon /></b> </>: <i>"This message was blocked"</i> }</b>
                                            </Text>
                                        )
                                    }
                                </Box>
{/* */}
                                {chat.latestMessage && !chat.isGroupChat && notification.map((not) => (
                                    <>
                                        {not.sender.name.toLowerCase().includes(chat.latestMessage.sender.name.toLowerCase())
                                            &&
                                            <>
                                                <Button colorScheme='green' ml={"20%"} display="flex"
                                                ><BellIcon /></Button>
                                            </>
                                        }
                                    </>
                                )
                                )
                                }
                            </Box>

                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    )
}

export default LeftSideBox
