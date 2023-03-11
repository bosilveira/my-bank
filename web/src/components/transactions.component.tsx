import React from 'react';
import { SearchIcon } from "@chakra-ui/icons";
import { Button, Box, Stack, StackDivider, IconButton } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, } from '@chakra-ui/react'

import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { userRedux, login, getWallet, newAccount, getTransactions } from '../redux/userSlice';
import { useNavigate } from "react-router-dom";

const Transactions = () => {
    const user = useAppSelector(userRedux);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return <>
    <Stack divider={<StackDivider />} spacing='4'>
        
        <Stack direction='row' spacing={4} align='center'>
            <Button colorScheme='teal' variant='solid' onClick={()=>navigate('/deposit')}>
                Depósito
            </Button>
            <Button colorScheme='teal' variant='solid' onClick={()=>navigate('/withdraw')}>
                Saque
            </Button>
            <Button colorScheme='teal' variant='solid' onClick={()=>navigate('/transfer')}>
                Transferência
            </Button>

        </Stack>

        <Box>


        <TableContainer>
            <Table variant='striped'>
                <Thead>
                    <Tr>
                        <Th>Transação</Th>
                        <Th>Conta</Th>
                        <Th isNumeric>Valor</Th>
                        <Th>Data</Th>
                        <Th></Th>
                    </Tr>
                    </Thead>
                <Tbody>

                {user?.transactions?.map( (item, index)=><Tr key={index}>
                        <Td>{item.idTransacao}</Td>
                        <Td isNumeric>{item.idConta}</Td>
                        <Td isNumeric>{item.valor}</Td>
                        <Td>{item.dataTransacao}</Td>
                    </Tr>) }


                </Tbody>
                <Tfoot>

                </Tfoot>
            </Table>
        </TableContainer>
        </Box>
    </Stack>
    </>

}

export default Transactions;
