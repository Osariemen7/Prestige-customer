import {useState} from 'react'
import OtpInput from 'react-otp-input';
import { useNavigate, Link, useLocation} from 'react-router-dom';
import OTPInput from 'react-otp-input';
import { Typography } from '@mui/material';
import { BootstrapButton} from './material.js'
import { ChakraProvider, Spinner } from '@chakra-ui/react';


const Verify = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate()
    const [message, setMessage] = useState("");
    const [buttonVisible, setButtonVisible] =useState(true)
    const location = useLocation();
  let num = location.state.item

  const handleClick = () => {
    // When the button is clicked, setButtonVisible to false
    setButtonVisible(false);
    setTimeout(() => {
      setButtonVisible(true);
    }, 10000);
  };

async function signup() {
    
        console.warn(num)
        let item = {num};
        let res = await fetch ('https://api.prestigedelta.com/verifyinit/',{
            method: 'POST',
            headers:{
              'Content-Type': 'application/json',
              'accept' : 'application/json'
         },
         body:JSON.stringify(item)
        });
                
        
        if (res.status !== 200) {
          setMessage("OTP not sent!");
        } else{
          setMessage('Otp sent!')
          res = await res.json();
      

        }}
   async function vet(e){
        e.preventDefault()
        handleClick()
        let res= JSON.parse(localStorage.getItem("user-info"));
        let reference = res.reference
        const item = {otp, reference}
        console.log(JSON.stringify(item))
        // Post the payload using Fetch:
        let sult= await fetch('https://api.prestigedelta.com/verifyconfirm/', {
          method: 'POST',
          headers:{
          'Content-Type': 'application/json'
        //   'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjYzNzk2NDY5LCJpYXQiOjE2NjM3OTYxNjksImp0aSI6IjMxM2M3YjgzY2QzYjQyMWJiMzcyNDc0MzA3MjYyNmJkIiwidXNlcl9pZCI6M30.UqMeJLcnNYUXYpxximYbbuw6KJ3Udj5crgp3R3NrjTM'
        },
        
        body:JSON.stringify(item),
      })
      if (sult.status !== 200) {
        setMessage("Incorrect Otp");
      } else {
        sult = await sult.json(); 
      navigate('/components/register', {state:{num}})
      }
    }
    console.log(num)
    return(
        <div>
        <Link to='/components/signup'><i class="fa-solid fa-chevron-left bac"></i></Link>
            
            <h2>Verify your phone number</h2>
            <p>Please enter the 4-digit verification code<br/> sent to your phone number in the boxes below</p>
           <div className='dtp'>
              <OTPInput  
                 value={otp}
                 onChange={setOtp}
                  numInputs={4}
                 renderSeparator={<span> </span>}
                 renderInput={(props) => <input {...props }  className='otp' />}
                />    
           </div><br/><br/>
           {buttonVisible && (  <BootstrapButton variant="contained" onClick={vet} disableRipple>
                   Next
      </BootstrapButton>
      )}  <ChakraProvider>
       {!buttonVisible && <Spinner />}</ChakraProvider> 
          
           <div className="message">{message ? <p>{message}</p> : null}</div>
           <p>Didn't get the code yet? <span className='lsf' onClick={signup}>Resend OTP</span></p>
           </div>
    )
}
export default Verify