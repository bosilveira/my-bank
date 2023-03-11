import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Card, CardBody, CardHeader, Heading, Stack, StackDivider, Text, Container, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Spinner } from "@chakra-ui/react";
import { LinkBox, LinkOverlay } from '@chakra-ui/react'
import Accounts from "./accounts.component";
import Transactions from "./transactions.component";
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { userRedux, login, logout, getWallet, newAccount, getTransactions } from '../redux/userSlice';
import { useNavigate } from "react-router-dom";

const Wallet = () => {
    const user = useAppSelector(userRedux);
    const dispatch = useAppDispatch();

    const contasHandler = () => {
        dispatch(getWallet());
    }
    const transacoesHandler = () => {
        dispatch(getTransactions());
    }
    const navigate = useNavigate();






    return <>

    <Container maxW='1200px' centerContent>
        <Card w='100%'>
            <CardHeader>
                <Heading size='md'>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={()=>navigate('/home')}>Minha Carteira</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={()=>navigate('/home')}>Início {user.status === 'loading' ? <Spinner /> : <></>}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                </Heading>
            </CardHeader>

            <Tabs variant='enclosed-colored'>
                <TabList>
                    <Tab>Acesso Rápido</Tab>
                    <Tab onClick={contasHandler}>Contas</Tab>
                    <Tab onClick={transacoesHandler}>Transações</Tab>
                    <Tab>Ajuda</Tab>
                </TabList>
                {user.status === 'loading' || 

                <TabPanels>

                    <TabPanel>

                        <CardBody>
                            <Stack divider={<StackDivider />} spacing='4'>
                                <LinkBox as='article'>
                                    <Box>
                                        <Heading size='xs' textTransform='uppercase'>
                                        <LinkOverlay onClick={()=>navigate('/deposit')}>
                                            Depósito
                                        </LinkOverlay>
                                        </Heading>
                                        <Text pt='2' fontSize='sm'>
                                            Permite que o usuário adicione fundos às suas contas.
                                        </Text>
                                    </Box>
                                </LinkBox>
                                <LinkBox as='article'>
                                    <Box>
                                        <Heading size='xs' textTransform='uppercase'>
                                        <LinkOverlay onClick={()=>navigate('/withdraw')}>
                                            Saque
                                        </LinkOverlay>
                                        </Heading>
                                        <Text pt='2' fontSize='sm'>
                                            Permite que o usuário retire fundos de suas contas.
                                        </Text>
                                    </Box>
                                </LinkBox>
                                <LinkBox as='article'>
                                    <Box>
                                        <Heading size='xs' textTransform='uppercase'>
                                        <LinkOverlay onClick={()=>navigate('/transfer')}>
                                            Transferência
                                        </LinkOverlay>
                                        </Heading>
                                        <Text pt='2' fontSize='sm'>
                                            Permite que o usuário transfira fundos de sua conta para outra conta.
                                        </Text>
                                    </Box>
                                </LinkBox>        
                                <LinkBox as='article'>
                                    <Box>
                                        <Heading size='xs' textTransform='uppercase'>
                                        <LinkOverlay href='#' onClick={()=>dispatch(logout())}>
                                            Sair / Logout
                                        </LinkOverlay>
                                        </Heading>
                                        <Text pt='2' fontSize='sm'>
                                            Encerra a sessão.
                                        </Text>
                                    </Box>
                                </LinkBox> 
                            </Stack>
                        </CardBody>

                    </TabPanel>
                    <TabPanel>
                        <Accounts/>
                    </TabPanel>
                    <TabPanel>
                        <Transactions/>
                    </TabPanel> 
                </TabPanels>}
            </Tabs>

        </Card>

    </Container>

    </>
}

export default Wallet;
