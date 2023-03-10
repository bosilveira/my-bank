import { Box } from "@chakra-ui/react";
import Login from "./login.form";
import { Center, Square, Circle } from '@chakra-ui/react'
import Wallet from "./wallet.component";

const HomePage = () => {
    return <>
    <Center w='100%' h='100%' padding='32px'>
        <Wallet/>

    </Center>
    
    </>
}
export default HomePage;