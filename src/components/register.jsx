import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { Typography, TextField } from '@mui/material';
import { BootstrapButton, ValidationTextField, CssTextField, ValidationEyeField} from './material.js'
import { ChakraProvider, Spinner } from '@chakra-ui/react';




const RegisterPage =()=>{
    const [passwordType, setPasswordType] = useState("password");
    const [email, setEmail] = useState('')
    const [first_name, setFirstname] = useState('');
    const [last_name, setLastname] = useState('');
    const [middle_name, setMiddlename] = useState('')
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [invite_code, setInvite] = useState('OSAZ872')
    const location= useLocation()
    const [message, setMessage] = useState("");
    const [check, setCheck] = useState('')
    const [buttonVisible, setButtonVisible] = useState(true);

    const navigate = useNavigate()
    const user = location.state.num
     
    
    let username = user.phone_number
   
    const handleClick = () => {
      // When the button is clicked, setButtonVisible to false
      setButtonVisible(false);
      setTimeout(() => {
        setButtonVisible(true);
      }, 10000);
    };
   const handleCheck =(event) =>{
    setCheck(event.target.value)
   }
    const handleEmailChange = (event) =>{
       setEmail(event.target.value)
    }
    const handleFirstChange = (event)=>{
         setFirstname(event.target.value)
    }
    const handleLastname = (event)=> {
         setLastname(event.target.value)
    }
    const handleInvitecode= (event)=> {
      setInvite(event.target.value)
 }
    const handleMiddlename = (event)=>{
         setMiddlename(event.target.value)
    }
    const handlePasswordChange =(evnt)=>{
        
      setPassword1(evnt.target.value);
  }
  const handlePasswordConfirm =(evnt)=>{
        
    setPassword2(evnt.target.value);
}
    const togglePassword =()=>{
        if(passwordType==="password")
        {
         setPasswordType("text")
         return;
        }
        setPasswordType("password")
      }
      async function reg() {
        
          handleClick()
            console.warn(username,invite_code, password1, password2, first_name, last_name, middle_name, email)
            let item = {username, invite_code, password1, password2, first_name, last_name, middle_name, email};
            let resut = await fetch ('https://api.prestigedelta.com/dj-rest-auth/registration/',{
                method: 'POST',
                headers:{
                  'Content-Type': 'application/json',
                  'accept' : 'application/json'
             },
             body:JSON.stringify(item)
            });
        
            if (check === ''){
              setMessage('Privacy policy and Terms and Condition must be checked')
          
            }  else if (resut.status !== 201) {
              resut = await resut.json();
              setMessage(JSON.stringify(resut));}
            else {
              resut = await resut.json();
              localStorage.setItem('user-info', JSON.stringify(resut)) 
              
              navigate('/components/personal')
            }
          }
          //
      return(
        <div style={{padding:'4%'}}>
      <Helmet>
         <title>Registration</title>
         </Helmet>
        <Typography  variant="h5" align='left' marginLeft='8%' marginTop='10%' fontWeight="fontWeightBold">Enter your Details</Typography>
            <br/><Typography align='left' marginLeft='8%' variant='subtitle2' >Let's set things up. You need to be invited by an existing member to join our merchant network. Please enter the invite code of your introducer</Typography>
          <br/> 
        <form>
        <ValidationTextField
           onChange={handleEmailChange}
        label="Email Address"
        type='email'
        required
        variant="outlined"
        id="validation-outlined-input"
      /> <br/><br/>
      <ValidationTextField
           onChange={handleFirstChange}
        label="First Name"
        type='text'
        required
        variant="outlined"
        id="validation-outlined-input"
      />
       <br/><br/>
       <ValidationTextField
           onChange={handleLastname}
        label="Last Name"
        type='text'
        required
        variant="outlined"
        id="validation-outlined-input"
      />
      <br/> <br/>
      <CssTextField label="Middle Name" onChange={handleMiddlename} id="custom-css-outlined-input" />
      <br/> <br/>
      <ValidationTextField
           onChange={handleInvitecode}
        label="Invite Code (optional)"
        type='text'
        required
        variant="outlined"
        id="validation-outlined-input"
      /><br/><br/>
      <ValidationEyeField
        onChange={handlePasswordChange}
        label="Create Password"
        type={passwordType}
        required
        variant="outlined"
        id="validation-outlined-input"
        name='password1'
      />
      
      { passwordType==="password"?
             <i onClick={togglePassword} style={{marginTop: '5%'}} class="fa-regular fa-eye-slash ic" ></i> : <i style={{marginTop: '5%'}} class="fa-regular fa-eye ic" onClick={togglePassword}></i>} <br/>
            <br/>
             <ValidationEyeField
        onChange={handlePasswordConfirm}
        label="Confirm Password"
        type={passwordType}
        required
        variant="outlined"
        id="validation-outlined-input"
        name='password2'
      />   
       { passwordType==="password"?
             <i onClick={togglePassword} style={{marginTop: '5%'}} class="fa-regular fa-eye-slash ic"></i> : <i style={{marginTop: '5%'}} class="fa-regular fa-eye ic" onClick={togglePassword}></i>} <br/>
             <br/>
             <input class="check" type="checkbox" name="" onChange={handleCheck} value="check" required></input>
             <label>By tapping next, you agree to our <a className='lsf' href='https://prestigefinance.co/policy.html'>privacy policy</a>and <a className='lsf' href='https://prestigefinance.co/terms.html'>Terms & Condition</a> </label>
             <div className="message">{message ? <p>{message}</p> : null}</div>
        </form><br/>
        {buttonVisible && (  <BootstrapButton variant="contained" onClick={reg} disableRipple>
                   Next
      </BootstrapButton>
      )}  <ChakraProvider>
       {!buttonVisible && <Spinner />}</ChakraProvider>
       
     </div>
      )
    
}
export default RegisterPage
