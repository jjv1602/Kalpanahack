import { Box } from "@chakra-ui/layout";
import { useMediaQuery } from "@chakra-ui/react";
import { ChatState } from "../../../Context/ChatProvider";
import SingleChat from "../SingleChat";

import './RightSideBox.css';

const RightSideBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  const [isLargerThan1000] = useMediaQuery('(min-width: 1000px)')
  return (
    <Box id="box"
      // display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      display={isLargerThan1000 ? 'flex' : (selectedChat ?  "flex":"none" )}
      alignItems="center"
      flexDir="column"
      pl={1}
      pr={1}
      w={isLargerThan1000 ? "80%":  "100%" }
      borderRadius="lg"
      borderWidth="1px"

    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default RightSideBox;
