import { ChakraProvider } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDisclosure, Input, Card, Text, Button, Heading, Stack, Spinner  } from "@chakra-ui/react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import good from './images/good.svg'



const Airtime =()=>{
const [biller_name, setBiller] = useState('');
const [amount, setAmount] = useState('');
const [bill, setBill] = useState([]);
const [buttonVisible, setButtonVisible] = useState(true);
const { isOpen, onOpen,  onClose } = useDisclosure()
const [outline, setOutline] = useState('');
const [loading, setLoading] = useState(true)
const [message, setMessage] = useState();
const [fun, setFun] = useState();
const [typedNumber, setTypedNumber] = useState('');
const [predictedAccount, setPredictedAccount] = useState(null);
const navigate = useNavigate()
   
const handleClick = () => {
    // When the button is clicked, setButtonVisible to false
    setButtonVisible(false);
    setTimeout(() => {
      setButtonVisible(true);
    }, 10000);
  }
    let tok= JSON.parse(localStorage.getItem("user-info"));
const terms = (tok) => {
  let refreshval;

  if (tok === null || typeof tok === 'undefined') {
    refreshval = 0;
  } else {
    refreshval = tok.refresh_token;
  }

  return refreshval;
};
let refresh = terms(tok)
    
async function fsav(e) {
    handleClick()
    e.preventDefault();
     let items ={refresh}
      let rep = await fetch ('https://api.prestigedelta.com/refreshtoken/',{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
            'accept' : 'application/json'
       },
       body:JSON.stringify(items)
      });
      rep = await rep.json();
      let bab = rep.access_token 
      
      let account_id = typedNumber
      console.warn(biller_name, account_id, amount)
      let item = {amount, account_id, biller_name};
    
  
    try {
      let result = await fetch('https://api.prestigedelta.com/bills/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${bab}`
        },
        body: JSON.stringify(item)
      });
      
            if (result.status !== 201) {
        const errorResult = await result.json();
        setMessage(JSON.stringify(errorResult.message));
      } else {
         result =await result.json();
         onOpen()
         setFun(JSON.stringify(result))    
      } 
    } catch (error) {
      // Handle fetch error
      console.error(error);
    };
  }
   
   const salesTra = async () => {
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
  let response = await fetch(`https://api.prestigedelta.com/bills/?bill_type=Airtime`,{
  method: "GET",
  headers:{'Authorization': `Bearer ${bab}`},
  })
  
  if (response.status === 401) {
    navigate('/components/login');
  } else {  
  response = await response.json();}
  setBill(response)
  setLoading(false)
  }
  useEffect(() => {
    salesTra()
  }, []) 
    const handleInputChange = (event) => {
      const inputValue = event.target.value;
      const formattedValue = formatNumber(inputValue);
      setAmount(formattedValue);
    };
  
    const formatNumber = (number) => {
      // Remove existing commas and non-numeric characters
      const cleanedNumber = number.replace(/[^0-9]/g, '');
      // Add commas every three digits
      const regex = /\B(?=(\d{3})+(?!\d))/g;
      return cleanedNumber.replace(regex, ',');
    };
    
  const predictAccount = (number) => {
    // Filter the data to find matching account_ids
    const matchingAccounts = bill.filter(account => account.account_id.startsWith(number));
    
    // Sort the matching accounts based on transaction_count in descending order
    matchingAccounts.sort((a, b) => b.transaction_count - a.transaction_count);

    // Take the account with the highest transaction_count (priority prediction)
    const priorityPrediction = matchingAccounts[0];
    
    return priorityPrediction ? priorityPrediction.account_id : null;
  };

  
  const handleNumber = (event) => {
    const inputNumber = event.target.value;
    setTypedNumber(inputNumber);
    const prediction = predictAccount(inputNumber);
    setPredictedAccount(prediction);
  };
  const handlePredictionClick = () => {
    if (predictedAccount) {
      setTypedNumber(predictedAccount);
      const matchingAccount = bill.find(account => account.account_id === predictedAccount);
      if (matchingAccount) {
        setBiller(matchingAccount.biller_name);
    }
  }};

  const openModal = (button) => {
    setBiller('glo')
    setOutline(button)
    
    };
    const openModal1 = (button) => {
      setBiller('mtn');
      setOutline(button)
    };
    const openModal2 = (button) => {
      setBiller('etisalat');
      setOutline(button)
    };
    const openModal3 = (button) => {
      setBiller('airtel');
      setOutline(button)
    };
    if(loading) {
      return(
      <p>Loading...</p>)} 

    return(
        <div style={{backgroundColor:'#F0F8FF', maxHeight:'100%', height: '100vh', paddingTop:'3%', zIndex:'0', alignItems: 'center', justifyContent: 'center'}}>
        <ChakraProvider>
        <Link to='/components/accounts'><i class="fa-solid fa-chevron-left bac"></i></Link>
       <br/>
        <p style={{marginTop: '15px'}}>Please select a network provider</p>
        <Stack direction='row' m={2} gap='10px' spacing={2} align='center' justify='center'>        
                   <Button colorScheme='blue' variant={outline  === 'glo'?'solid' : 'outline'} onClick={() =>openModal('glo')}>GLO</Button> 
                   <Button colorScheme='blue' variant={outline ==='mtn' ? 'solid' : 'outline'} onClick={() =>openModal1('mtn')}>MTN</Button> 
                   <Button colorScheme='blue' variant={outline ==='etisalat' ?'solid' : 'outline'} onClick={() =>openModal2('etisalat')}>9mobile</Button>
                   <Button colorScheme='blue' variant={outline ==='airtel' ?'solid' : 'outline'} onClick={() =>openModal3('airtel')}>Airtel</Button>
                   </Stack>
           <br/>
           <div className='mobile-view'>
          <span style={{fontSize:'30px'}}>₦</span> <Input
            width={173}
            fontSize='20px'
          ml={1}
           type='text'
             value={amount}
      onChange={handleInputChange}
            placeholder="Amount"
           /><br/><br/>
           <Input
            width={273}
          ml={2}
          fontSize='20px'
             type="number"
             value={typedNumber}
             onChange={handleNumber}
            placeholder="Phone Number"
           />
           </div>
            <div className='desktop-view'>
      <Input
            width={400}
          ml={5}
           type='text'
             value={amount}
      onChange={handleInputChange}
            placeholder="Amount"
           /><br/><br/>
           <Input
            width={400}
          ml={5}
             type="number"
             value={typedNumber}
             onChange={handleNumber}
            placeholder="Phone Number"
           />
      </div>
      
           <br/>
           {typedNumber.length === 11?(null):<div>
            {predictedAccount && (
        <p onClick={handlePredictionClick}> {predictedAccount}</p>
      )}<br/></div>}
      {buttonVisible && (  <Button colorScheme='blue' mr={3}  onClick={fsav}>Proceed</Button> 
                )}
      {!buttonVisible && <p>Processing...</p>}
      <p>{message}</p>

      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
        <ModalContent>
  
          <ModalHeader>Successful</ModalHeader>
          <ModalCloseButton />
          <ModalBody> 
            
     
      <div>
          <img style={{marginLeft: '37%'}} src={good} alt="" />
          <Heading fontSize='14px'>Successfully Funded!</Heading>  
      </div>

            </ModalBody>
              </ModalContent>
        </Modal>
           </ChakraProvider>
        </div>
    )
}
export default Airtime