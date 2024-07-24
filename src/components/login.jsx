import { useState } from "react"
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom"
import { Typography, TextField } from '@mui/material';
import { BootstrapButton, ValidationTextField, CssTextField, ValidationEyeField} from './material.js'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useDisclosure, Button, Input, ChakraProvider } from "@chakra-ui/react"



const LoginPage = () => {
    const [message, setMessage] = useState("");
    const [passwordType, setPasswordType] = useState("password");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState('');
    const [messag, setMessag] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const modal2 = useDisclosure()
  

    const openModal = () => {
      setIsOpen(true);
    };
    const closeModal = () => {
      setIsOpen(false);
    };
   
    const handleEmailChange = (event) =>{
      setEmail(event.target.value)
   }
    const handleUsernameChange =(evnt) => {

        setUsername((evnt.target.value).replace('0', '234'));
    }
    const handlePasswordChange =(evnt)=>{
        
        setPassword(evnt.target.value);
    }
    const togglePassword =()=>{
      if(passwordType==="password")
      {
       setPasswordType("text")
       return;
      }
      setPasswordType("password")
    }
    // useEffect (() => {
    //     if (localStorage.getItem('user-info')) {
    //            navigate.push('/component/signup')
    //     }
    // }, [])
  
    async function login(e) {
      e.preventDefault();
      console.warn(username, password);
      let item = { username, password };
      let response = await fetch(
        'https://api.prestigedelta.com/dj-rest-auth/login/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify(item),
        }
      );
    
      if (response.status !== 200) {
        setMessage('Invalid Username/Password');
      } else {
        let result = await response.json();
        localStorage.setItem('user-info', JSON.stringify(result))
        if (result.user.paystack_id === null) {
          localStorage.setItem('user-info', JSON.stringify(result))
          navigate('/components/personal', {state:{result}})
        }  else if(result.user.is_customer === true){
          localStorage.setItem('user-info', JSON.stringify(result));
          navigate('/components/loyalty')
        }else {
          localStorage.setItem('user-info', JSON.stringify(result));
          navigate('/components/map');
        }
      }
    }
    
    async function ema(e) {
      e.preventDefault();
      
        console.warn(email)
        let item = { email};
        let result = await fetch ('https://api.prestigedelta.com/emailotp/',{
            method: 'POST',
            headers:{
              'Content-Type': 'application/json',
              'accept' : 'application/json',
          
         },
         body:JSON.stringify(item)
        });
      
        if (result.status !== 200) {
          const errorResult = await result.json();
          setMessag(JSON.stringify(errorResult.message));
        } else {
          result = await result.json();
     
        navigate('/components/token')
        }
      }
   
    return(
        <div style={{padding: '4%', marginTop: '3%'}}>
        <Helmet>
            <title>Log in Page</title>
            
        </Helmet>
        <Typography fontSize='30px' marginLeft='5%' fontWeight='600' className="lh" gutterBottom>
        Welcome Back
      </Typography>
            <p className="lp">Let's get started with some basic information about your business </p>

           <br/>
          <form>
            <ValidationTextField
           onChange={handleUsernameChange}
        label="Phone Number"
        type="number"
        required
        variant="outlined"
        id="validation-outlined-input"
      />
      <br/> <br/><br/>
      <ValidationEyeField
        onChange={handlePasswordChange}
        label="Password"
        type={passwordType}
        required
        variant="outlined"
        id="validation-outlined-input"
        name='password1'
      />
      
      { passwordType==="password"?
             <i onClick={togglePassword} class="fa-regular fa-eye-slash ic" ></i> : <i  class="fa-regular fa-eye ic" onClick={togglePassword}></i>} <br/>
            <br/><br/>
            <BootstrapButton variant="contained" type="submit" onClick={login} disableRipple>
                   Login
      </BootstrapButton>

                <div className="message">{message ? <p>{message}</p> : null}</div>
                <p className="lop" onClick={modal2.onOpen}>Forgot Password?</p>
            </form>
            <footer className="fot">Dont have an account? <Link to='/components/signup'><span className="lsf">Sign Up</span></Link></footer>
            
            <ChakraProvider>
            <Modal isOpen={modal2.isOpen} onClose={modal2.onClose}>
        <ModalOverlay />
        <ModalContent>
  
          <ModalHeader>Confirm Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody> 
      
      <div>
      <h4 className='h4'></h4>
      <form>
      <Input placeholder='Email Address' size='md' type="email" onChange={handleEmailChange} width={273} ml={9}/><br/><br/>
     
        <br />
        <div className="message">{messag ? <p>{messag}</p> : null}</div>
          
                <Button colorScheme='blue' onClick={ema}>Next</Button>
            </form>
            </div>
            
            </ModalBody>
              </ModalContent>
        </Modal>
            </ChakraProvider>
           
        </div>
    )
 }
 export default LoginPage