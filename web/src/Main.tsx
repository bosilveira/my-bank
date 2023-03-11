import { Routes, Route } from 'react-router-dom';
import HomePage from './components/Home.page';
import LoginPage from './components/Login.page';
import StartPage from './components/Start.page';
import SignupPage from './components/Signup.page';
import DepositPage from './components/Deposit.page';
import WithdrawPage from './components/Withdraw.page';
import TransferPage from './components/Transfer.page';
import NewAccountPage from './components/NewAccount.page';

const Main = () => {
return (         
    <Routes>
    <Route path='/' element={<StartPage/>} />
    <Route path='/home' element={<HomePage/>} />
    <Route path='/login' element={<LoginPage/>} />
    <Route path='/signup' element={<SignupPage/>} />
    <Route path='/deposit' element={<DepositPage/>} />
    <Route path='/withdraw' element={<WithdrawPage/>} />
    <Route path='/transfer' element={<TransferPage/>} />
    <Route path='/new_account' element={<NewAccountPage/>} />
  </Routes>
);
}
export default Main;