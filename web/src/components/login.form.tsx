import { Flex, InputGroup, InputRightElement } from '@chakra-ui/react'
import React from 'react';
import {
    Button
  } from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input
  } from '@chakra-ui/react'


const Login = () => {

    const [email, setEmail] = React.useState('')
    const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)

    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    const isError = email === ''
      
    return (<>
    <Flex direction='column' gap='16px' maxWidth='xl' borderWidth='1px' borderRadius='lg' bgColor='white' padding='16px' width='320px'>
        <FormControl isInvalid={isError}>
            <FormLabel>Email</FormLabel>
            <Input type='email' value={email} onChange={emailHandler} />
            {!isError ? (
                <FormHelperText>
                    Enter the email you'd like to receive the newsletter on.
                </FormHelperText>
            ) : (
                <FormErrorMessage>
                    Email is required.
                </FormErrorMessage>
            )}
        </FormControl>

        <FormControl isInvalid={isError}>
            <FormLabel>Senha</FormLabel>
            <InputGroup>
                <Input
                    pr='4.5rem'
                    type={show ? 'text' : 'password'}
                    placeholder='Enter password'
                />
                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Ocultar' : 'Exibir'}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <Button colorScheme='blue'>Login</Button>
    </Flex>
    </>
    )

}

export default Login;
