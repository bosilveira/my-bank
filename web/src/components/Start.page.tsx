import { Button, Card, CardBody, CardFooter, CardHeader, Container, Heading, Text, Image } from "@chakra-ui/react";
import { Center } from '@chakra-ui/react'

const StartPage = () => {
    return <>
    <Center  bgColor='#F8B634'>
        <Image
            objectFit='cover'
            src='01.png'
            alt='Chakra UI'
            maxH='480px'
        />
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
export default StartPage;