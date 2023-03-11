import React from 'react';
import Login from "./login.form";
import { Button, Card, CardBody, CardFooter, CardHeader, Center, Container, Heading, Text } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { userRedux, login, getWallet } from '../redux/userSlice';
import { useAppSelector, useAppDispatch } from '../redux/hooks';

const LoginPage = () => {

    const navigate = useNavigate();
    const user = useAppSelector(userRedux);
    const dispatch = useAppDispatch();

    React.useEffect(()=>{
        if (user.status === 'logged') {
            dispatch(getWallet());
            navigate('/home');
        }
    })

    return <>
    <Center bgColor='#F8B634'>
        <Container maxW='1200px' width='100%' height='480px' flexDir='row' gap='16px' display='flex' justifyContent='right' alignItems='flex-start'
        bgImage='02.png' backgroundSize='auto 480px' backgroundRepeat='no-repeat' backgroundPosition='left' padding='32px'>
            <Login/>
        </Container>
    
    </Center>


        
    <Container maxW='1200px' centerContent  flexDir='row' gap='16px' alignItems='stretch' padding='16px 0'>
        <Card>
            <CardHeader>
                <Heading size='md'> Acesso Imediato ao<br/>Mercado de Capitais</Heading>
            </CardHeader>
            <CardBody>
                <Text>Acesso Instantâneo à Sua Conta Bancária na Palma da Sua Mão!</Text>
            </CardBody>
            <CardFooter>
                <Button>Baixe o App</Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <Heading size='md'>Mobilidade e Segurança de<br/>Ponta em Todas as Plataformas</Heading>
            </CardHeader>
            <CardBody>
                <Text>Faça Seus Pagamentos e Transações de Forma Rápida e Segura!</Text>
            </CardBody>
            <CardFooter>
                <Button>Inscreva-se</Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <Heading size='md'>Benefícios para Gerenciar<br/>seu Patrimônio</Heading>
            </CardHeader>
            <CardBody>
                <Text>A Plataforma de Finanças Pessoais Mais Prática e Inovadora!</Text>
            </CardBody>
            <CardFooter>
                <Button>Saiba Mais</Button>
            </CardFooter>
        </Card>

    </Container>

    </>
}
export default LoginPage;