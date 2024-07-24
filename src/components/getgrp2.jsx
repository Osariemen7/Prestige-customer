import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import OtpInput from 'react-otp-input';
import { BootstrapButton } from "./material";
import { ChakraProvider } from '@chakra-ui/react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
  import { useDisclosure, Input, Card, Text, Button, Heading, Stack, Spinner  } from "@chakra-ui/react"
  import { Typography, TextField } from '@mui/material';

const PostMon=()=> {
    const [pin, setPin] = useState('');
    const { isOpen, onOpen,  onClose } = useDisclosure()
    const [message, setMessage] = useState('')
    const [pinExpired, setPinExpired] = useState(false);
    const [user, setUser] = useState('')
    const [buttonVisible, setButtonVisible] = useState(true);
     const navigate = useNavigate();
     const location = useLocation();
     let meal = location.state.data
   
     let tok= JSON.parse(localStorage.getItem("user-info"));
    const terms = (tok) => {
       let refreshval;

  if ( tok === null || typeof tok === "undefined" ) {
    refreshval = 0;
  } else {
    refreshval = tok.refresh_token;
  }

  return refreshval;
};

const closeModal = () => {
    onClose()
  };
  

  useEffect(() => {
    let timer;
    
    if (pin === '') {
      // Start a timer if the input is empty
      timer = setTimeout(() => {
        setPinExpired(true);
      }, 20000); // 30 seconds
    } else {
      // Clear the timer if there's input
      clearTimeout(timer);
      setPinExpired(false);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [pin]);

  const handleClick = () => {
    // When the button is clicked, setButtonVisible to false
    setButtonVisible(false);
    setTimeout(() => {
      setButtonVisible(true);
    }, 20000);
  };

  const fetchData = async () => {
    let item ={refresh}
    let rep = await fetch ('https://api.prestigedelta.com/refreshtoken/',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'accept' : 'application/json'
     },
     body:JSON.stringify(item)
    });
    rep = await rep.json();
    let bab = rep.access_token
  let respet = await fetch("https://api.prestigedelta.com/transferpinid/?sms=false",{
  method: "GET",
  headers:{'Authorization': `Bearer ${bab}`},
  })
  respet = await respet.json();
  localStorage.setItem('user-info', JSON.stringify(tok))
//   if (data.code === 'token_not_valid'){
//     navigate('/components/token')
//   } else {
    setUser(respet)
  }
  const fetchDat = async () => {
    let item ={refresh}
    let rep = await fetch ('https://api.prestigedelta.com/refreshtoken/',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'accept' : 'application/json'
     },
     body:JSON.stringify(item)
    });
    rep = await rep.json();
    let bab = rep.access_token
  let respet = await fetch("https://api.prestigedelta.com/transferpinid/?sms=true",{
  method: "GET",
  headers:{'Authorization': `Bearer ${bab}`},
  })
  respet = await respet.json();
  localStorage.setItem('user-info', JSON.stringify(tok))
//   if (data.code === 'token_not_valid'){
//     navigate('/components/token')
//   } else {
  setUser(respet)
  }
let refresh = terms(tok)

     async function transfer(e) {
        e.preventDefault();
        handleClick()
        let amount = meal.amount
        const pent =(user, meal)=>{
          let pun
          if(user === ''){
            pun = meal.pin_id.pin_id
          } else{
            pun = user.pin_id
          }
          return pun
        }
        let pin_id = pent(user, meal)
        let narration = meal.narration
        let bank_code = meal.selectedOption.value
        let nuban = meal.nuban
        let account_name = meal.users.account_name
        let bank = meal.selectedOption.label
        let sub_account = meal.selectedOptions
        let item ={refresh}
        let rep = await fetch ('https://api.prestigedelta.com/refreshtoken/',{
            method: 'POST',
            headers:{
              'Content-Type': 'application/json',
              'accept' : 'application/json'
         },
         body:JSON.stringify(item)
        });
        
        rep = await rep.json();
        let bab = rep.access_token
          console.warn(amount, pin_id, narration, sub_account, nuban, account_name, pin, bank_code )
          let ite ={amount, bank, nuban, sub_account, account_name, pin, bank_code, narration}
          let items = {amount, pin_id, narration, sub_account, nuban, account_name, pin, bank_code};
          let resut = await fetch ('https://api.prestigedelta.com/banktransfer/',{
              method: 'POST',
              headers:{
                'Content-Type': 'application/json',
                'accept' : 'application/json',
                'Authorization': `Bearer ${bab}`
           },
           body:JSON.stringify(items)
          });       
            
          if (resut.status !== 201) {
            const errorResult = await resut.json();
            setMessage(JSON.stringify(errorResult.message)); 
            setButtonVisible(true)
          } else {
            
            resut = await resut.json();
          navigate('/components/getrec', {state:{ite}} )         
        }
        
        }
        console.log(meal)
    return(
        <div>
        <Link to='/components/accounts'><i class="fa-solid fa-chevron-left bac"></i></Link>
        <Typography  variant="h6"  marginLeft='3%' marginTop='3%' fontWeight="fontWeightBold">Confirm Details</Typography>
                  
               <div style={{backgroundColor:'rgb(235, 245, 248)', padding: '1%', margin:'4%'}}>
               <Typography  variant="h6"  margin='4%'  fontWeight="fontWeightBold">Tranfer ₦{(parseInt(meal.amount)).toLocaleString('en-US')} to<br/> {meal.users.account_name}</Typography>
              <h4></h4>
           </div>
           <div style={{marginLeft:'5%', marginRight:'5%'}}>
           <div className="vasa">
              <p>Account Number</p>
              <p>{meal.nuban}</p>
              
           </div>
           <br/>
           <hr style={{border:'1px, dotted, lightblue'}}/>
           <div className="vasa2">
               <p>Bank</p>
               <p>{meal.selectedOption.label}</p>
           </div>
           </div>
<br/>
           <div style={{backgroundColor:'rgb(235, 245, 248)', padding: '1%', margin:'4%', alignItems: 'center', justifyContent: 'center'}}>
             <p>Be sure of the account details before sending<br/> funds as this cannot be reversed</p>
           </div>
           {pinExpired === true ? (
  user === '' ? (
    <div>
      <h4>
        Send OTP to{' '}
        <span className="lop" onClick={fetchData}>
          Email?
        </span>{' '}
        or{' '}
        <span className="lop" onClick={fetchDat}>
          Phone Number?
        </span>
      </h4>
    </div>
  ) : (
    <div>Done</div>
  )
) : null} <br/><br/>
<div style={{padding:'5%'}}>
<BootstrapButton variant="contained" onClick={onOpen} disableRipple>
                   Continue
      </BootstrapButton></div>
      <ChakraProvider>
      <Modal isOpen={isOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
          
            <ModalHeader>Enter OTP</ModalHeader>
            <ModalCloseButton />
            <ModalBody>

          
             <p>Enter the 4-digit verification code<br/> sent to your phone number in the boxes below</p>
           <OtpInput  
                 value={pin}
                 onChange={setPin}
                  numInputs={4}
                 renderSeparator={<span> </span>}
                 renderInput={(props) => <input {...props }  className='totp' />}
                />
                {pinExpired === true ? (
  user === '' ? (
    <div>
      <p className="dnc">
        Time out. Resend OTP to{' '}
        <span className="lop" onClick={fetchData}>
          Email?
        </span>{' '}
        or{' '}
        <span className="lop" onClick={fetchDat}>
          Phone Number?
        </span>
      </p>
    </div>
  ) : (
    <div>Done</div>
  )
) : null}

<div className="message">{message ? <p>{message}</p> : null}</div>
      {buttonVisible === true ?  <Button colorScheme="blue" variant='solid' onClick={transfer}>Transfer</Button> : <p>Processing...</p>}
      </ModalBody>
              </ModalContent>
              
           </Modal></ChakraProvider>
        </div>
    )
}
export default PostMon