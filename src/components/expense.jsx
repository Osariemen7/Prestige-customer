import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {CategoryScale,Chart as ChartJS,Legend, ArcElement, LinearScale,Title, Tooltip } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useNavigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
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
import { Nav } from './nav.jsx'




ChartJS.register(CategoryScale, LinearScale,Title,Tooltip,Legend, ArcElement, ChartDataLabels);

const Expense = () => {
  const [info, setInfo] = useState([])
  const [loading, setLoading]= useState(true)
  const [inputLabels, setInputLabels] = useState('');
  const [message, setMessage] = useState();
  const [buttonVisible, setButtonVisible] = useState(true);
   const { isOpen, onOpen,  onClose } = useDisclosure()
  const [fun, setFun] = useState('');
  const [name, setName] = useState('')
  const [budget, setBudget] = useState('')
  const [new_name, setNew] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState(new Date())

  
  const navigate = useNavigate()

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

  const handleClick = () => {
    // When the button is clicked, setButtonVisible to false
    setButtonVisible(false);
    setTimeout(() => {
      setButtonVisible(true);
    }, 10000);
  }

  const currentDate = new Date(); // Get the current date

  const thirtyDaysBefore = new Date(); // Create a new Date object
  thirtyDaysBefore.setDate(currentDate.getDate() - 30)  

  const fetchInfo = async () => {
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
      let response = await fetch(`https://api.prestigedelta.com/transactionlist/?start_date=${thirtyDaysBefore.toLocaleDateString('en-US')}&end_date=${(new Date()).toLocaleDateString('en-US')}`,{
      method: "GET",
      headers:{'Authorization': `Bearer ${bab}`},
      })
      
      if (response.status === 401) {
        navigate('/components/login');
      } else {  
      response = await response.json();
        setInfo(response.expense_categories);
        setLoading(false);
      }}
           useEffect(() => {
        fetchInfo()
        }, [])

        const handleInputChange = (event) => {
          setBudget(event.target.value);
        };
        const handleChange = (event) => {
          setNew(event.target.value);
        };
        const handleName =(event) => {
          setName(event.target.value)
        }      
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
            
            
            console.warn(new_name,name, budget)
            let item = {budget, name, new_name};
          
        
          try {
            let result = await fetch('https://api.prestigedelta.com/expenses/', {
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
               
               setFun(JSON.stringify(result))    
            } 
          } catch (error) {
            // Handle fetch error
            console.error(error);
          };
        }
        const Infow = async () => {
          
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
        let response = await fetch(`https://api.prestigedelta.com/transactionlist/?start_date=${(new Date(start)).toLocaleDateString('en-US')}&end_date=${(new Date(end)).toLocaleDateString('en-US')}`,{
        method: "GET",
        headers:{'Authorization': `Bearer ${bab}`},
        })
        
        if (response.status === 401) {
          navigate('/components/login');
        } else {  
        response = await response.json();}
        
        setInfo(response)
      
        }
   
        const begin =(event)=>{
          setStart(event.target.value)
        }
        const conc =(event)=>{
          setEnd(event.target.value)
        }
        
        
      
  if(loading) {
    return(
    <p>Loading...</p>)} 
    const data = {
      labels: info.map((user) => user.name),
      datasets: [{
        data: info.map((user) => user.ratio),
        backgroundColor: [
          'red',
          'blue',
          'yellow',
          'green',
          'purple',
          'orange'
        ],
        hoverBackgroundColor: [
          'rgba(255,99,132,0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ]
      }]
    };
    const updatedInfo = (index) => {
      let item = { ...info[index] }; // Create a copy of the item at the specified index
      if (item.budget === "0.00") {
        return item.expense; // Return expense if budget is "0.00"
      } else {
        return item.budget; // Return budget otherwise
      }
    };
    console.log(updatedInfo(0))
    return (
    <div style={{backgroundColor:'#F0F8FF', maxHeight:'100%', height: '100vh', paddingTop:'3%', zIndex:'0', alignItems: 'center', justifyContent: 'center'}}>
    <ChakraProvider>
    <Nav/>
    <Heading fontSize='20px'>Pie Chart</Heading>
    <Stack direction='row' spacing={1} justify='center' >
<div>
         <Heading fontSize='12px'>Start Date</Heading>
        <Input placeholder='' defaultValue={(thirtyDaysBefore).toISOString().slice(0, 10)}  size='md' type='date' onChange={begin} width={173} ml={3}/><br/><br/>
        </div> 
        <div>
        <Heading fontSize='12px'>End Date</Heading>
        <Input placeholder='Date' size='md' defaultValue={new Date().toISOString().slice(0, 10)} type='date' onChange={conc} width={173} ml={2}/><br/><br/>
        </div></Stack> 
        <Button colorScheme='blue' variant='outline' 
         w='230px' onClick={() => Infow()}>Filter</Button>
    </ChakraProvider>
    <div className='mobile-view'>
    <div style={{ width: '60%', marginLeft: '20%' }}>
    <Pie data={data} />
  </div>
  <br/>
    {info.map((obj, index) => (
    
  <div key={index} className='spt'>
  
      <div>
        <div className=''>
        <ChakraProvider>
        <Heading fontSize='14px'>{obj.name}</Heading>
        </ChakraProvider>
        <div className='bfle'>
        <p>₦{obj.expense.toLocaleString('en-US')}</p>
        <p className='clun'>
            {Math.round(((parseInt(obj.expense) / parseInt(updatedInfo(index))) * 100 + Number.EPSILON) * 100) / 100}%
          </p>
        </div>
          
          </div>
        <div className="progress-b" style={{ width: '100%' }}>
          <div className="progress-bi" style={{ width:`${Math.min(((parseInt(obj.expense) / parseInt(updatedInfo(index))) * 100), 100)}%` }}>
          </div>
        </div>
        <p>budget: ₦{obj.budget.toLocaleString('en-US')}</p>
        </div>
      </div>))}
  </div>
  <div className='desktop-view'>
  <div className='content'>
  <div style={{ width: '400px', marginLeft: '350px' }}>
    
    <Pie data={data} />
  </div>
  <br/>
    {info.map((obj, index) => (
    
  <div key={index} className='spt'>
  
      <div>
        <div className='asx'>
        <div className='bfle'>
        <p>₦{obj.expense.toLocaleString('en-US')}</p>
        <p className='clun'>
            {Math.round(((parseInt(obj.expense) / parseInt(updatedInfo(index))) * 100 + Number.EPSILON) * 100) / 100}%
          </p>
        </div>
          
          </div>
        <div className="progress-b" style={{ width: '100%' }}>
          <div className="progress-bi" style={{ width:`${Math.min(((parseInt(obj.expense) / parseInt(updatedInfo(index))) * 100), 100)}%` }}>
          </div>
        </div>
        <p>budget: ₦{obj.budget.toLocaleString('en-US')}</p>
        </div>
      </div>))}
      </div>
    </div>
    
    
     
      <ChakraProvider>
      <Button colorScheme='blue' mr={3}  onClick={onOpen}>Edit Expense</Button>
      <Modal isOpen={isOpen} onClose ={onClose}>
          <ModalOverlay />
          <ModalContent>
          
            <ModalHeader></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
      {fun === '' ? (
      <div>
      
      <Input type='text' placeholder='Previous Name' width={273} ml={9} onChange={handleName}/><br />
      <br/>
            <Input type='text' placeholder='New Name' width={273} ml={9} onChange={handleChange}/><br />
      <br/> 
      <Input type='number' placeholder='Set Budget Amount' width={273} ml={9} onChange={handleInputChange}/><br />
      <br/>
      {message ? <p>{message}</p> : null} 
                {buttonVisible && (  <Button  colorScheme='blue' variant='solid' onClick={fsav}>Save</Button> 
                )}
      {!buttonVisible && <p>Processing...</p>}
            
            </div>) :
            <div>
          
          <img className='goo' src={good} alt="" />
          <Heading fontSize='14px' className="hoo">Budget Successfully  Edited</Heading>  
      </div>}
      </ModalBody>
              </ModalContent>
      
            </Modal>
            </ChakraProvider>
  </div>
    );
};

export default Expense;
