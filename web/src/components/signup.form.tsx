import React from 'react';
import { Flex, InputGroup, InputLeftAddon, InputRightElement, Link, Button, Spinner, FormControl, Input } from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { userRedux, signup } from '../redux/userSlice';

const Signup = () =>  {

    const user = useAppSelector(userRedux);
    const dispatch = useAppDispatch();

    const [nome, setNome] = React.useState('')
    const [cpf, setCPF] = React.useState('')
    const [nascimento, setNascimento] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [senha, setSenha] = React.useState('')
    const nomeHandler = (e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)
    const cpfHandler = (e: React.ChangeEvent<HTMLInputElement>) => setCPF(e.target.value)
    const nascimentoHandler = (e: React.ChangeEvent<HTMLInputElement>) => setNascimento(e.target.value)
    const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
    const senhaHandler = (e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)

    const formHandler = () => {
        dispatch(signup({nome, cpf, nascimento, email, senha}));
    }

    const [show, setShow] = React.useState(false)
    const showHandler = () => setShow(!show)

    const isError = user.status === 'failed'
    
    return <>
    <Flex direction='column' gap='16px' maxWidth='xl' borderWidth='1px' borderRadius='lg' bgColor='white' padding='16px' width='320px'>
        <FormControl isInvalid={isError}>
            <InputGroup>
                <InputLeftAddon children='Nome' />
                <Input type='text' 
                placeholder='Seu nome'
                value={nome} onChange={nomeHandler} />
            </InputGroup>
        </FormControl>
        <FormControl isInvalid={isError}>
            <InputGroup>
                <InputLeftAddon children='CPF' />
                <Input type='text' 
                placeholder='123.456.789-10'
                value={cpf} onChange={cpfHandler} />
            </InputGroup>
        </FormControl>
        <FormControl isInvalid={isError}>
            <InputGroup>
                <InputLeftAddon children='Nascimento' />
                <Input type='text' value={nascimento} 
                placeholder='dd/mm/aaaa'
                onChange={nascimentoHandler} />
            </InputGroup>
        </FormControl>

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

        <Button colorScheme='blue' onClick={formHandler} leftIcon={user.status == 'loading' ? <Spinner /> : <></>}>Inscreva-se</Button>

        <Link href='/login' alignSelf='center'>
            Ir para Login <ArrowForwardIcon/>
        </Link>

    </Flex>
    </>

}

export default Signup;
