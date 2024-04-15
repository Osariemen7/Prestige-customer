import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Typography, TextField, Autocomplete } from '@mui/material';
import { BootstrapButton, ValidationTextField, CssTextField, ValidationEyeField} from './material.js'
import { ChakraProvider, Spinner } from '@chakra-ui/react';

  
const PersonalPage =() => {
    const [message, setMessage] = useState("");
    const [gender, setGender] = useState('');
    const [dob1, setDob] = useState('');
    const [bvn, setBvn] = useState('');
    const [buttonVisible, setButtonVisible] = useState(true);

    const navigate = useNavigate();
    
    const handleGender = (event, newValue) => {
        setGender(newValue);}
      
    
    const handleDob =(event)=>{
    setDob(event.target.value)
}
    const handleBvn =(event)=>{
    setBvn(event.target.value)
}
const handleClick = () => {
    // When the button is clicked, setButtonVisible to false
    setButtonVisible(false);
    setTimeout(() => {
      setButtonVisible(true);
    }, 10000);
  };
   
const date = new Date(dob1);
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
let dob = `${day}/${month}/${year}`;

const options = ['Male', 'Female' ]

const handleSubmit=()=>{
  handleClick()
  let data ={dob, bvn, gender}
  if ( dob.length < 1 || bvn.length < 1 || gender.length < 1){
    setMessage('All Fields must be Filled')
  }
  else {
  
  navigate('/components/resident', {state:{data}})
}}
    return(
        <div style={{padding:'4%'}}>
        <Typography  variant="h5" align='left' marginLeft='7%' marginTop='10%' fontWeight="fontWeightBold">Enter your pesonal information</Typography>
       <br/> <Typography align='left' marginLeft='7%' variant='subtitle2' >Please enter your BVN, regulations require us to verify your identity</Typography>
          <br/>
            <form>
            
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Autocomplete
      id="combo-box-demo"
      value={gender}
      options={options}
      onChange={handleGender}
      sx={{ width: '88%', maxWidth:'100%', align: 'center' }}
      renderInput={(params) => <TextField {...params} label="Select Gender" />}    
    /> </div>  <br/>
    <Typography textAlign='left' marginLeft='7%'>Date of birth</Typography>         
    <ValidationTextField
           onChange={handleDob}
        label=""
        type='date'
        required
        variant="outlined"
        id="validation-outlined-input"
      /> <br/><br/>
        <ValidationTextField
           onChange={handleBvn}
        label="Bank Verification Number"
        type='number'
        required
        variant="outlined"
        id="validation-outlined-input"
      />
       <br/><br/>
                <div className="message">{message ? <p>{message}</p> : null}</div>
                <br/>{buttonVisible && (  <BootstrapButton variant="contained" onClick={handleSubmit} disableRipple>
                   Next
      </BootstrapButton>
      )}  <ChakraProvider>
       {!buttonVisible && <Spinner />}</ChakraProvider>
       
                  </form>
        
        </div>
    )
}
export default PersonalPage