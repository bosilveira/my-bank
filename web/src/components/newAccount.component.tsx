import { Button, Tabs, TabList, Tab, TabPanels, TabPanel, Box, Card, CardBody, CardHeader, Heading, Stack, StackDivider, Text, Container, Spinner, Breadcrumb, BreadcrumbItem, BreadcrumbLink, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Select } from '@chakra-ui/react'

const NewAccount = () => {
    return <>

    <Container maxW='1200px' centerContent>
        <Card w='100%'>
            <CardHeader>
                <Heading size='md'>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='#'>Minha Carteira</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href='#'>Nova Conta  <Spinner /></BreadcrumbLink>
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
                                        View a summary of all your clients over the last month.
                                    </Text>
                                </Box>

                                <Stack width='320px'  spacing='24px'>

                                    <FormControl isInvalid={false}>
                                        <FormLabel>Conta Remetente</FormLabel>
                                        <Select placeholder='Conta'>
                                        <option value='option1'>Option 1</option>
                                        <option value='option2'>Option 2</option>
                                        <option value='option3'>Option 3</option>
                                        </Select>   
                                    </FormControl>
                                    <FormControl isInvalid={false}>
                                        <FormLabel>Conta Destinatária</FormLabel>
                                        <Input type='text' 
                                        placeholder='Seu nome'
                                        value={''} onChange={()=>{}} />
                                    </FormControl>
                                    <FormControl isInvalid={false}>
                                        <FormLabel>Valor</FormLabel>
                                        <Input type='text' 
                                        placeholder='Seu nome'
                                        value={''} onChange={()=>{}} />
                                    </FormControl>
                                    <Button colorScheme='blue'>Confirmar </Button>
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

export default NewAccount;
