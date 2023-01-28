export const isSameSenderMargin = (messages, m, i, userId) => {
  // m- current message
  // i-index of current message

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 33;
  else return "auto";
};

export const isfirst_msg_of_Sender = (messages, m, i, userId) => {
  return (
    (i < messages.length && i>0 && 
    messages[i - 1].sender._id !== messages[i].sender._id &&
    messages[i].sender._id !== userId ) || (i===0&& messages[i].sender._id !== userId  )
    )
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};
export const checkingBlockContent = (blockWords, ImgOCRContent) => {
  for (let i = 0; i < blockWords.length; i++) {
    const arr = blockWords[i].split(" ");
    let AllWordsPresent = true;
    for (let j = 0; j < arr.length; j++) {
      if (!ImgOCRContent.toLowerCase().includes(arr[j].toLowerCase())) {
        AllWordsPresent = false;
        break;
      }
    }
    if (AllWordsPresent) {
      return true;
    }
  }
  return false;
};


export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

//   Exported to DisplayChatPg.js
export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
