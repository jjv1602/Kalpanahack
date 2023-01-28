
import ScrollableFeed from "react-scrollable-feed";
import {
  isSameSender,
  isSameSenderMargin,
  isSameUser, isfirst_msg_of_Sender, checkingBlockContent,
} from "../../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import './ScrollableChat.css';
import { Avatar, Box, Heading, Image, Text, Tooltip } from '@chakra-ui/react'
import { useEffect, useState } from "react";
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [blockWords, setblockWords] = useState(userInfo.blockWords);
  const [blockSwitch, setBlockSwitch] = useState(userInfo.blockSwitch);
  const [AllWordsPresent, setAllWordsPresent] = useState(false);
  useEffect(() => {
    setblockWords(userInfo.blockWords);
    setBlockSwitch(userInfo.blockSwitch);
  }, [localStorage.getItem('userInfo')]);
  return (

    <>
      {messages &&
        messages.map((m, i) => (
          <>
            <div style={{ display: "flex" }} key={m._id}>
              {isfirst_msg_of_Sender(messages, m, i, user._id)  && !m.isImg && 
                <>
                  <Avatar id="av" size='md' ml={"-40px"} src={m.sender.pic ? m.sender.pic :"https://bit.ly/dan-abramov"} />
                  <Box  className= "sender_msg"
                    style={{
                      backgroundColor: `${m.sender._id === user._id ? "#B9F5D0" : "#BEE3F8"
                        }`,
                        position:"relative",
                      marginLeft: isSameSenderMargin(messages, m, i, user._id),
                      marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                      marginBottom: "20px",
                      borderRadius: "9px",
                      padding: "5px 15px",
                      maxWidth: "75%",
                    }}

                  >
                    <Heading size="sm">{m.sender.name}</Heading>
                    {m.isImg ? <Image
                      boxSize='150px'
                      objectFit='cover'
                      src={m.ImgContent}
                      alt='Dan Abramov'
                    /> : (<></>)}
                    <Text>{m.content}</Text>
                  </Box>

                </>
              }
              {isfirst_msg_of_Sender(messages, m, i, user._id) && m.isImg && blockWords && !checkingBlockContent(blockWords, m.ImgOCRContent) &&
                <>
                  <Avatar id="av" size='lg' src={m.sender.pic ? m.sender.pic :"https://bit.ly/dan-abramov"} />
                  <Box  className= "sender_msg"
                    style={{
                      backgroundColor: `${m.sender._id === user._id ? "#B9F5D0" : "#BEE3F8"
                        }`,
                        position:"relative",
                      marginLeft: isSameSenderMargin(messages, m, i, user._id),
                      marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                      marginBottom: "10px",
                      borderRadius: "9px",
                      padding: "5px 15px",
                      maxWidth: "75%",
                    }}

                  >
                    <Heading size="sm">{m.sender.name} </Heading>
                    {m.isImg ? <Image
                      boxSize='150px'
                      objectFit='cover'
                      src={m.ImgContent}
                      alt='Dan Abramov'
                    /> : (<></>)}
                    <Text>{m.content}</Text>
                  </Box>

                </>
              }

              {!isfirst_msg_of_Sender(messages, m, i, user._id) &&
              <>
                {(m.isImg && blockWords&& (!checkingBlockContent(blockWords, m.ImgOCRContent) || m.sender.name === user.name)) &&
                <>
                  <Box className={m.sender._id === user._id ? "You_msg": " "}
                    style={{
                      backgroundColor: `${m.sender._id === user._id ? "#B9F5D0" : "#BEE3F8"
                        }`,
                        position:"relative",
                      marginLeft: isSameSenderMargin(messages, m, i, user._id),
                      marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                      marginBottom: "10px",
                      borderRadius: "9px",
                      padding: "5px 15px",
                      maxWidth: "75%",
                      
                    }}
                  >
                    <Heading size="sm">{m.sender.name === user.name ? "You" : m.sender.name}</Heading>
                    <Image
                      boxSize='150px'
                      objectFit='cover'
                      src={m.ImgContent}
                    />
                    <Text >{m.content}</Text>
                  </Box>
                </>
              }

              {!m.isImg && <>
                <Box  className={m.sender._id === user._id ? "You_msg": " "}
                    style={{
                      backgroundColor: `${m.sender._id === user._id ? "#B9F5D0" : "#BEE3F8"
                        }`,
                        position:"relative",
                      marginLeft: isSameSenderMargin(messages, m, i, user._id),
                      marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                      marginBottom: "10px",
                      borderRadius: "9px",
                      padding: "5px 15px",
                      maxWidth: "75%",
                    }}
                  >
                <Heading size="sm">{m.sender.name === user.name ? "You" : m.sender.name}</Heading>
                <Text >{m.content}</Text>
                </Box>
              </>}
              </>
              }

            </div>
          </>
        ))
      }
    </>
  );

};

export default ScrollableChat;
