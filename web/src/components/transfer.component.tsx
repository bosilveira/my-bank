import React from 'react';
import { Button, Tabs, TabList, Tab, TabPanels, TabPanel, Box, Card, CardBody, CardHeader, Heading, Stack, StackDivider, Text, Container, Breadcrumb, BreadcrumbItem, BreadcrumbLink, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Select } from '@chakra-ui/react'
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { userRedux, login, getWallet, deposit, transfer } from '../redux/userSlice';
import { useNavigate } from "react-router-dom";
import { useToast } from '@chakra-ui/react'

const Transfer = () => {

    const user = useAppSelector(userRedux);
    const dispatch = useAppDispatch();

    const [remetente, setRemetente] = React.useState('')
    const [destinatario, setDestinatario] = React.useState('')

    const [valor, setValor] = React.useState('')
    const navigate = useNavigate();
    const selectRemetenteHandler = (e: React.ChangeEvent<HTMLSelectElement>) => setRemetente(e.currentTarget.value);
    const selectDestinatarioHandler = (e: React.ChangeEvent<HTMLSelectElement>) => setDestinatario(e.currentTarget.value)

    const valorHandler = (e: React.ChangeEvent<HTMLInputElement>) => setValor(parseFloat(e.currentTarget.value).toString())

    const formHandler = () => {
        dispatch(transfer({ 'idConta_remetente': remetente, 'idConta_destinatario': destinatario, 'valor': valor }));
    }

    const toast = useToast();
    React.useEffect(()=>{

        if (user.status === 'update') {
            dispatch(getWallet());
            navigate('/home');
        }

        if (user.status === 'update') {
            toast({
            title: 'Transferência Confirmada',
            description: "Transação Executada com Sucesso",
            status: 'success',
            duration: 9000,
            isClosable: true,
            })
        }

        if (user.status === 'failed') {
            toast({
            title: 'Erro ao Processar Comando',
            description: "Tente Novamente",
            status: 'error',
            duration: 9000,
            isClosable: true,
            })
        }

    },[user.status])

    return <>

    <Container maxW='1200px' centerContent>
        <Card w='100%'>
            <CardHeader>
                <Heading size='md'>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={()=>navigate('/home')}>Minha Carteira {valor}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={()=>navigate('/transfer')}>Transferência</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                </Heading>
            </CardHeader>

            <Tabs variant='enclosed-colored'>
                <TabList>
                    <Tab>Transferir</Tab>
                    <Tab>Ajuda</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>

                        <CardBody>
                            <Stack divider={<StackDivider />} spacing='4'>
                                <Box>
                                    <Heading size='xs' textTransform='uppercase'>
                                        Transferência
                                    </Heading>
                                    <Text pt='2' fontSize='sm'>
                                        Transfira fundos de sua conta para outra conta.
                                    </Text>
                                </Box>

                                <Stack width='320px'  spacing='24px'>

                                    <FormControl isInvalid={false}>
                                        <FormLabel>Conta Remetente</FormLabel>
                                        
                                    <Select placeholder='Remetente' onChange={selectRemetenteHandler}>
                                        {user?.carteira?.contas.map( (item, index)=><option key={index} value={item.idConta} >{item.idConta}</option>  )}

                                    </Select>   
                                    </FormControl>
                                    <FormControl isInvalid={false}>
                                        <FormLabel>Conta Destinatária</FormLabel>
                                        <Select placeholder='Destinatário' onChange={selectDestinatarioHandler}>
                                        {user?.carteira?.contas.map( (item, index)=><option key={index} value={item.idConta} >{item.idConta}</option>  )}
                                        </Select>   

                                    </FormControl>
                                    <FormControl isInvalid={false}>
                                        <FormLabel>Valor</FormLabel>
                                        <Input type='text' 
                                        placeholder='Quantia'
                                        value={valor} onChange={valorHandler} />
                                    </FormControl>
                                    <Button colorScheme='blue' onClick={formHandler}>Confirmar </Button>
                                </Stack>
                            </Stack>
                        </CardBody>

                    </TabPanel>
                    <TabPanel>
                        <p>Ajuda!</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>


        </Card>

    </Container>
    </>        
}

export default Transfer;
