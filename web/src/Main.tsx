import { Routes, Route } from 'react-router-dom';
import HomePage from './components/Home.page';
import LoginPage from './components/Login.page';
import StartPage from './components/Start.page';
import SignupPage from './components/Signup.page';

const Main = () => {
return (         
    <Routes>
    <Route path='/' element={<StartPage/>} />
    <Route path='/admin' element={<HomePage/>} />
    <Route path='/login' element={<LoginPage/>} />
    <Route path='/signup' element={<SignupPage/>} />
  </Routes>
);
}
export default Main;