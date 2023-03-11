import React from 'react';
import { Center } from '@chakra-ui/react'
import Wallet from "./wallet.component";

import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { userRedux, login, getWallet } from '../redux/userSlice';
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    const user = useAppSelector(userRedux);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    React.useEffect(()=>{
        if (user.status === 'logout') {
            navigate('/')

        }
        if (user.status !== 'loading' && user.status !== 'update' && !user.carteira) {
            navigate('/login')
        }
    },[user.status])


    return <>
    <Center w='100%' h='100%' padding='32px'>
        <Wallet/>
    </Center>
    </>
}
export default HomePage;