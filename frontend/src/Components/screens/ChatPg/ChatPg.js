import React, { useEffect, useState } from 'react'
import Header from './Header/Header'
import style from './ChatPg.module.css';
import { useNavigate } from 'react-router-dom';
import LeftSideBox from './LeftSideBox/LeftSideBox';
import { Box } from '@chakra-ui/react';
import RightSideBox from './RightSideBox/RightSideBox';
import { ChatState } from '../../Context/ChatProvider';
// import { useNavigate } from 'react-router-dom';
const ChatPg = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const {user}=ChatState();
  
  return (
    <div className={style.main}>
      <Header></Header>
      <Box display="flex" p={"2px"}  w="100%" h={"88vh"}>
        {user&&<LeftSideBox ></LeftSideBox>}
        {user&&<RightSideBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></RightSideBox>}
      </Box>

    </div>
  )
}

export default ChatPg
