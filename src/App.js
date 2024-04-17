import React, {useState, useEffect} from 'react';
import './App.css';
import ScreenLoad from './components/opening';
import LandPage from './components/landing';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/login';
import Signup from './components/signup';
import Verify from './components/verify';
import RegisterPage from './components/register';
import PersonalPage from './components/personal';
import Select from './components/select';
import ThankPage from './components/Thanks';
import FundPage from './components/fund';
import TokenPage from './components/token';
import Accounts from './components/accounts.jsx';
import PostMon from './components/getgrp2';
import Receipt from './components/getrec';
import GetGroup from './components/getgroup';
import Recdet from './components/Receipt';
import Overdraft from './components/overdraft.jsx';
import Resident from './components/resident';
import Business from './components/rebout';
import Bud from './components/reboard';
import Credit from './components/credit';
import Chat from './components/chat';
import Update from './components/update';
import Last from './components/last'
import Referral from './components/referral.jsx';
import Support from './components/support.jsx';
function App() {
  const [loading, setLoading] = useState(true)
  
 
  
    useEffect(() => {
    setTimeout(() => setLoading(false), 3000)
  }, [])
  return (
    <>
         {loading === false ? (
    
    <div className="App">
     <Routes>
        <Route path='/' element={<LandPage />}/>
        <Route path='/components/login' element={<LoginPage />}/>
        <Route path='/components/signup' element={<Signup />}/> 
        <Route path='/components/verify' element={<Verify />}/> 
        <Route path= '/components/register' element={<RegisterPage />} />
        <Route path= '/components/personal' element ={<PersonalPage />} />
        <Route path= '/components/thanks' element={<ThankPage />} />
        <Route path='/components/fund' element={<FundPage />} />
        <Route path= '/components/token' element={<TokenPage />} />
        <Route path='/components/update' element={<Update />} />
        <Route path='/components/select' element={<Select />} />
        <Route path='/components/accounts' element={<Accounts />} />
        <Route path='/components/getgrp2' element={<PostMon />} />
        <Route path='/components/getrec' element={<Receipt />} />
        <Route path='/components/getgroup' element={<GetGroup />} />
        <Route path='/components/Receipt' element={<Recdet />} />
        <Route path='/components/resident' element={<Resident />} />
        <Route path='/components/rebout' element={<Business />} />
        <Route path='/components/reboard' element={<Bud />} />
        <Route path='/components/credit' element={<Credit />} />
        <Route path='/components/chat' element={<Chat />} />  
        <Route path='/components/last' element={<Last />} />
        <Route path='/components/support' element={<Support />} />
        <Route path= '/components/referral' element={<Referral />} />
        <Route path='/components/overdraft' element={<Overdraft/>} />

     </Routes>
      
    </div>
    ) : (
        <ScreenLoad/>
      )}
      </>
  );
}


export default App;
