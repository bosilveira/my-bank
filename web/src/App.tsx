import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import Main from './Main';
import Header from './components/header.component';

function App() {
  return (
    <ChakraProvider>
        <Header/>
        <Main />        
    </ChakraProvider>
  );
}

export default App;
