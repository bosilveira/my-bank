import { Box } from "@chakra-ui/react";
import Login from "./login.form";
import { Center, Square, Circle, Image, Container } from '@chakra-ui/react'
import Signup from "./signup.form";

const SignupPage = () => {
    return <>
    <Center bgColor='#F8B634'>
        <Container maxW='1200px' width='100%' height='480px' flexDir='row' gap='16px' display='flex' justifyContent='right' alignItems='flex-start'
        bgImage='03.png' backgroundSize='auto 480px' backgroundRepeat='no-repeat' backgroundPosition='left' padding='32px'>
            <Signup/>
        </Container>
    </Center>
    </>
}
export default SignupPage;