import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ValidationTextField, BootstrapButton } from './material';
import { Typography } from '@mui/material';
import { ChakraProvider, Spinner } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

const Signup = () => {
    const [message, setMessage] = useState("");
    const [messag, setMessag] = useState('')
    const [phone_number, setPhoneNumber] = useState('')
    const [buttonVisible, setButtonVisible] = useState(true);

    const navigate = useNavigate()
    

    const handlePhoneChange = (e) => (
        setPhoneNumber((e.target.value).replace('0', '234'))
    )
    const handleClick = () => {
      // When the button is clicked, setButtonVisible to false
      setButtonVisible(false);
      setTimeout(() => {
        setButtonVisible(true);
      }, 15000);
    };
    async function signup(e) {
      e.preventDefault();
        handleClick()
        console.warn(phone_number)
        let item = {phone_number};
        let res = await fetch ('https://api.prestigedelta.com/verifyinit/',{
            method: 'POST',
            headers:{
              'Content-Type': 'application/json',
              'accept' : 'application/json'
         },
         body:JSON.stringify(item)
        });
                
        
        if (item.phone_number.length !== 13) {
          setMessage("Invalid Phone number!");
        } else{
          setMessag('loading')
          res = await res.json();
          localStorage.setItem('user-info', JSON.stringify(res))
          
          navigate('/components/verify', {state:{item}});   

        }
        console.log(item)
      }
      
    return(
        <div>
        <Helmet>
            <title>Sign up Page</title>
            
        </Helmet>
           <Link to='/'><i class="fa-solid fa-chevron-left bac"></i></Link>
            <div style={{padding: '2%', marginTop: '5%', alignItems: 'center', justifyContent: 'center' }}>
           <Typography variant="h5" align='left' marginLeft='6%' fontWeight="fontWeightBold" >Create your Prestige Account</Typography>
           <h2></h2>
           <Typography align='left' marginLeft='6%' variant='subtitle2' >Let's set things up. Enter your details as they appear on your legal documents.</Typography>
           <p ></p>
            <br/>
           <form>
           <ValidationTextField
           onChange={handlePhoneChange}
        label="Phone Number"
        type='number'
        required
        variant="outlined"
        id="validation-outlined-input"
      />   <br/><br/><br/>
     {buttonVisible && (  <BootstrapButton variant="contained" onClick={signup} disableRipple>
                   Next
      </BootstrapButton>
      )}  <ChakraProvider>
       {!buttonVisible && <Spinner />}</ChakraProvider> 
              <div className="message">{message ? <p>{message}</p> : null}</div>
              <div className="message">{messag ? <p>{messag}</p> : null}</div>
           </form>
           </div>
        </div>
     )
     
}
export default Signup