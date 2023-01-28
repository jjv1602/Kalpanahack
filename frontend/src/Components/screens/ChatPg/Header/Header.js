import {
    Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, MenuItem, Image, Avatar, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, GridItem, Grid, Badge, useMediaQuery
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import NotificationBadge from "react-notification-badge";  //installed using npm install --save react-notification-badge
import { Effect } from "react-notification-badge";
import { BellIcon, ChatIcon, ChevronDownIcon, CloseIcon, Icon } from '@chakra-ui/icons'; //https://chakra-ui.com/docs/components/icon/usage
import style from './Header.module.css';
import ProfileModal from '../ProfileModal/ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from '../../../Loading/ChatLoading';
import { ChatState } from '../../../Context/ChatProvider';
import SearchListItem from '../SearchListItem/SearchListItem';
import { getSender } from "../../../../config/ChatLogics";
import { Switch } from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
} from '@chakra-ui/react'

const Header = () => {
    const toast = useToast();
    const btnRef = React.useRef();//for drawer
    const [new_block_word, setNew_block_word] = useState("");
    const [blockWords, setblockWords] = useState(JSON.parse(localStorage.getItem('userInfo')).blockWords);
    const[blockSwitch,setBlockSwitch]=useState(false);
    const [isLargerThan1000] = useMediaQuery('(min-width: 1000px)')
    // const userInfo=JSON.parse(localStorage.getItem('userInfo')).name;
    const userInfo=JSON.parse(localStorage.getItem('userInfo'));
    const [email, setEmail] = useState(userInfo.email);
    const {
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        block_good_morning, setBlockGoodMorning,
    } = ChatState();
    const navigate = useNavigate();
    const logout = () => {
        setUser("");
        localStorage.removeItem("userInfo");
        navigate("/");
    }
    const { isOpen, onOpen, onClose } = useDisclosure()
    


    const add_block_word = () => {
        if (new_block_word !== "") {
            
            setblockWords([...blockWords, new_block_word]);
        }
    }

    const removeItemfromblock = (txt) => {
        
        delete blockWords[blockWords.findIndex((el) => el === txt)];
        setblockWords(blockWords.filter(n=>n));
        console.log("blockWords");
        console.log(blockWords.filter(n=>n));
    }

    const updateBlockList=async(email,blockWords,blockSwitch)=>{
            try {
                console.log(userInfo);
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.put(`/api/users/modify_block_words_list`, { email,blockWords,blockSwitch }, config);
                localStorage.setItem("userInfo", JSON.stringify(data));    
                toast({
                    title: "Block List Saved",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
            } catch (error) {
                toast({
                    title: "Error Updating block list",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                });
            }
        }
    
    return (
        <Box
            w="100%"
            h="12vh"
            bg="#ffffff"
            borderWidth="5px"
            p="2px 10px 5px 10px"
            display="flex"
            alignItems="center"
            justifyContent='space-between'
        >

            <Image alt="logo" src={require("../../Assets_Img/website_logo_chat_pg.jpg")} 
            width={isLargerThan1000 ? "8%":"15%"}
            style={{ height: "90%", borderRadius: "50%" }}></Image>

            <Text fontSize="4xl" className={style.app_name}>
                Splice Chat
            </Text>
            <div className={style.menu}>
                <Menu >
                    <MenuButton p={1}>
                        <NotificationBadge count={notification.length} effect={Effect.SCALE} />
                        <BellIcon fontSize="4xl" m={1} />
                    </MenuButton>
                    <MenuList>
                        {!notification.length && "No New Messages"}
                        {notification.map((notif) => (
                            <MenuItem
                                key={notif._id}
                                onClick={() => {
                                    setSelectedChat(notif.chat);
                                    setNotification(notification.filter((n) => n !== notif));
                                }}
                            >
                                {notif.chat.isGroupChat
                                    ? `New Message in ${notif.chat.chatName}` 
                                    : `New Message from ${getSender(user, notif.chat.users)}`}
                            </MenuItem>))}
                    </MenuList>
                </Menu>
                <Menu >
                    <MenuButton p={4} m={1} as={Button} rightIcon={<ChevronDownIcon />}>
                        <Avatar
                            size="sm"
                            cursor="pointer"
                            src={userInfo.pic}
                        />
                    </MenuButton>
                    <MenuList p={2} bg={"#dce5f8"}>
                        <ProfileModal user={user}>
                            <MenuItem fontSize="1.4rem" fontFamily={"'Fredoka', sans-serif "} fontWeight="normal">My Profile</MenuItem>{" "}
                        </ProfileModal>
                        <MenuItem >
                            <FormControl display='flex' alignItems='center' >
                                <FormLabel htmlFor='email-alerts' mb='0' fontSize="1.4rem" fontFamily={"'Fredoka', sans-serif "}>
                                    Block Images with text
                                </FormLabel>
                                </FormControl>
                            <Button onClick={add_block_word}>Add Word</Button>
                            <br></br>
                        </MenuItem>
                        <Input width='auto' color={"#ffffff"} w={80} onChange={(e) => setNew_block_word(e.target.value)} placeholder='Type the word to Block' bg={"#2e2c42"} />
                        <br></br>
                        <Box w='90%' mt={3} p={4} bg='#ffffff'>

                            {blockWords && blockWords.map((txt) => (
                                <Badge colorScheme='red' fontSize='0.8em' p={1} m={1} >{txt} <Button m={1} size="sm" onClick={() => removeItemfromblock(txt)}><Icon as={CloseIcon} boxSize={2} /></Button></Badge>
                            )
                            )}
                            <br></br>    
                            <Button colorScheme='teal' size='md' m={2} ml="70%" onClick={()=>updateBlockList(email,blockWords,blockSwitch)}>
                                Save
                            </Button>
                        </Box>
                        
                        <MenuItem onClick={logout} fontSize="1.4rem" fontFamily={"'Fredoka', sans-serif "}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box >
    )
}

export default Header
