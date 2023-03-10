import { Box, Flex, InputGroup, InputRightElement, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react';
import logo from './logo.svg';
import { Center, Square, Circle } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Button
  } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input
  } from '@chakra-ui/react'


function Signup() {
    const [email, setEmail] = React.useState('')
    const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)

    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    const isError = email === ''
    
    return (<>
        <Flex direction='column' gap='16px' maxWidth='xl' borderWidth='1px' borderRadius='lg' bgColor='white' padding='16px' width='320px'>

        <Tabs>
  <TabList>
    <Tab>Dados Pessoais</Tab>
    <Tab>Acesso</Tab>
  </TabList>

  <TabPanels>
    <TabPanel>
    <FormControl isInvalid={isError}>
                    <FormLabel>Nome</FormLabel>
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
                    <FormLabel>CPF</FormLabel>
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
                    <FormLabel>Data de Nascimento</FormLabel>
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
    </TabPanel>
    <TabPanel>


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
                </FormControl>    </TabPanel>
    <TabPanel>
      <p>three!</p>
    </TabPanel>
  </TabPanels>
</Tabs>




                <Button colorScheme='blue'>Login</Button>
            </Flex>
          </>
        )

}

export default Signup;
