import React from 'react';
import { Flex, InputGroup, InputLeftAddon, InputRightElement, Link, Button, Spinner, FormControl, Input } from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { userRedux, login } from '../redux/userSlice';

const Login = () => {

    const user = useAppSelector(userRedux);
    const dispatch = useAppDispatch();

    const [email, setEmail] = React.useState('')
    const [senha, setSenha] = React.useState('')
    const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
    const senhaHandler = (e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)

    const formHandler = () => {
        dispatch(login({email, senha}));
    }

    const [show, setShow] = React.useState(false)
    const showHandler = () => setShow(!show)

    const isError = user.status === 'failed'
      
    return <>
    <Flex direction='column' gap='16px' maxWidth='xl' borderWidth='1px' borderRadius='lg' bgColor='white' padding='16px' width='320px'>

        <FormControl isInvalid={isError}>
            <InputGroup>
                <InputLeftAddon children='Email' />
                <Input type='text' value={email} 
                placeholder='Seu email'
                onChange={emailHandler} />
            </InputGroup>
        </FormControl>

        <FormControl isInvalid={isError}>
            <InputGroup>
                <InputLeftAddon children='Senha' />
                <Input
                    value={senha} onChange={senhaHandler}
                    pr='4.5rem'
                    type={show ? 'text' : 'password'}
                    placeholder='Sua senha'
                />
                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={showHandler}>
                    {show ? 'Ocultar' : 'Exibir'}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <Button colorScheme='blue' onClick={formHandler} leftIcon={user.status == 'loading' ? <Spinner /> : <></>}>Login </Button>

        <Link href='/signup' alignSelf='center'>
            Inscreva-se <ArrowForwardIcon/>
        </Link>

    </Flex>
    </>

}

export default Login;
