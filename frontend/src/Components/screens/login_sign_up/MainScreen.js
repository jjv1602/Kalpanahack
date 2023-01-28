import React, { useEffect } from 'react'
import { Box, Container, Tab, TabList, TabPanels,TabPanel, Tabs } from '@chakra-ui/react'
import style from './MainScreen.module.css';
import Login from './Login';
import Signup from './Signup';
import { useNavigate } from 'react-router-dom';

const MainScreen = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chat");
  }, [navigate]);
  
  return (
    <body className={style.main}>
    <Container maxW="xl"  centerContent className={style.container}>
      <Box >
        <div className={style.par_img}>
          <img className={style.logo} alt="logo" src={require("../Assets_Img/website_logo.jpg")}></img>
        </div>
        <Box className={style.authbox}>
          <Tabs isFitted variant="soft-rounded">
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tab>Sign Up</Tab>
            </TabList>
            <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
          </Tabs>
        </Box>
        
      </Box>
    </Container>
  </body>
  )
}

export default MainScreen
