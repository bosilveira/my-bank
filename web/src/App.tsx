import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import { Link} from 'react-router-dom';
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
