import tick from './images/tick.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import {Button, Heading,Card} from '@chakra-ui/react';
import { Nav } from './nav.jsx'
import { ShareApp } from './nav.jsx';


const Support=()=>{
     const navigate= useNavigate()
     let tok= JSON.parse(localStorage.getItem("user-info"));
     
      function create() {
        
        navigate('/components/inventory')
      }
      console.log(tok)
    return(
        <div style={{backgroundColor:'#F0F8FF', maxHeight:'100%', height: '100vh', paddingTop:'3%', zIndex:'0', alignItems: 'center', justifyContent: 'center'}}>
        <Nav />
          <ChakraProvider>
          <Heading fontSize='15px' textAlign='left' marginLeft='7%' marginTop='2%'>Hi {tok.user.first_name} how can we help you?</Heading>
           
            <br/>
            <Card m='5%' backgroundColor='#008080' p='3%' color='#fff'>
            <Heading fontSize='18px' mb='3%'>Support and Assistance</Heading>
          <p>Need help  with your account, send an email to <span style={{fontWeight: 'bold'}}>support@prestigefinance.co</span></p>
          <br/><p>or Call your account manager on<br/><span style={{fontWeight: 'bold'}}> 0706 567 5105</span> </p>
          </Card>
            </ChakraProvider> 
           
        </div>
    )
}
export default Support