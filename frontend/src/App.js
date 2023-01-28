import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatProvider from './Components/Context/ChatProvider';
import ChatPg from './Components/screens/ChatPg/ChatPg';
import MainScreen from './Components/screens/login_sign_up/MainScreen';


function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/chat" element={<ChatPg />} />
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;
