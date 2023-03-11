import { Button, Box, Stack, StackDivider, Switch } from "@chakra-ui/react";

import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableContainer,
  } from '@chakra-ui/react'


import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { userRedux, login, getWallet, newAccount } from '../redux/userSlice';

const Accounts = () => {

    const user = useAppSelector(userRedux);
    const dispatch = useAppDispatch();

    return <>
    <Stack divider={<StackDivider />} spacing='4'>
        <Box>
            <Button colorScheme='teal' variant='solid' onClick={()=>dispatch(newAccount())}>
                Nova Conta
            </Button>
        </Box>

        <TableContainer>
            <Table variant='striped'>
                <Thead>
                    <Tr>
                        <Th>Conta</Th>
                        <Th isNumeric>Saldo</Th>
                        <Th isNumeric>Limite</Th>
                        <Th>Criada em</Th>
                    </Tr>
                </Thead>
                <Tbody>

                    {user && user?.carteira?.contas?.map(item=><Tr>
                        <Td>{item.idConta}</Td>
                        <Td isNumeric>{item.saldo}</Td>
                        <Td isNumeric>{item.limiteSaqueDiario}</Td>
                        <Td>{item.dataCriacao}</Td>
                    </Tr>) }
                </Tbody>
                <Tfoot>

                </Tfoot>
            </Table>
        </TableContainer>

        </Stack>
    </>
}

export default Accounts;
